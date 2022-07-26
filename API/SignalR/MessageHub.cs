using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class MessageHub: Hub
    {
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _hubContext;
        private readonly PresenceTracker _presenceTracker;
        private readonly IUnitOfWork _unitOfWork;
        public MessageHub(IUnitOfWork unitOfWork,IMapper mapper, IHubContext<PresenceHub> hubContext, PresenceTracker presenceTracker)
        {
            this._unitOfWork = unitOfWork;
            this._presenceTracker = presenceTracker;
            this._hubContext = hubContext;
            this._mapper = mapper;
        }

        public override async Task OnConnectedAsync(){
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(Context.User.GetUsername(),otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId,groupName);
            var group = await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup",group);

            var messages = await _unitOfWork.MessageRepository.GetMessageThread(Context.User.GetUsername(),otherUser);
            if(_unitOfWork.HasChanges()) await _unitOfWork.Complete();
            await Clients.Caller.SendAsync("ReceiveMessageThread",messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception){
            var group = await RemoveFromMessageGroup();
             await Clients.Group(group.Name).SendAsync("UpdatedGroup",group);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto){
            
            var username = Context.User.GetUsername();
            if (username == createMessageDto.RecepientUsername.ToLower())
            {
                throw new HubException("You cannot sent messages to yourself");
            }

            var sender = await _unitOfWork.UserRepository.GetUserByUserNameAsync(username);
            var recepient = await _unitOfWork.UserRepository.GetUserByUserNameAsync(createMessageDto.RecepientUsername);
            if (recepient==null)
            {
               throw new HubException("Not found user");
            }

            var message = new Message{
                Sender = sender,
                Recepient = recepient,
                SenderUsername = sender.UserName,
                RecepientUsername = recepient.UserName,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName,recepient.UserName);
            var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);

            if (group.Connections.Any(x=>x.UserName == recepient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }else{
                var connections = await _presenceTracker.GetConnectionForUser(recepient.UserName);
                if (connections!=null)
                {
                    await _hubContext.Clients.Clients(connections).SendAsync("NewMessageReceived",
                     new {userName = sender.UserName, knownAs = sender.KnownAs});
                }
            }

            _unitOfWork.MessageRepository.AddMessage(message);

            if (await _unitOfWork.Complete())
            {
                await Clients.Group(groupName).SendAsync("NewMessage",_mapper.Map<MessageDto>(message));
            }
        }

        private async Task<Group> AddToGroup(string groupName){
            var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId,Context.User.GetUsername());
            if (group==null)
            {
                group = new Group(groupName);
                _unitOfWork.MessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if(await _unitOfWork.Complete()){
                return group;
            }

            throw new HubException("Failed to join group");
        } 

        private async Task<Group> RemoveFromMessageGroup(){
            var group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x=>x.ConnectionId==Context.ConnectionId);
            _unitOfWork.MessageRepository.RemoveConnection(connection);
            if(await _unitOfWork.Complete())
            {
                return group;
            }

            throw new HubException("Failed to remove from group");
        }

        private string GetGroupName(string caller, string other){
            var stringCompare = string.CompareOrdinal(caller,other) < 0;
            return stringCompare? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}