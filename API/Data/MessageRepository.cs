using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext context,IMapper mapper)
        {
            this._mapper = mapper;
            this._context = context;
            
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await _context.Groups.Include(c => c.Connections)
            .Where(c => c.Connections.Any(c=>c.ConnectionId==connectionId))
            .FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int messageId)
        {
            return await _context.Messages.Include(u=>u.Sender).Include(u=>u.Recepient).SingleOrDefaultAsync(x=>x.Id==messageId);
        }

        public async Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
            .OrderByDescending(m=>m.MessageSent)
            .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
            .AsQueryable();

            messages = messageParams.Container switch{
                "Inbox"=>messages.Where(m=>m.RecepientUsername == messageParams.UserName && !m.RecepientDeleted),
                "Outbox"=>messages.Where(m=>m.SenderUsername == messageParams.UserName && !m.SenderDeleted),
                _ => messages.Where(m=>m.RecepientUsername == messageParams.UserName && !m.RecepientDeleted &&m.DateRead == null)
            };


            return await PagedList<MessageDto>.CreateAsync(messages,messageParams.PageNumber,messageParams.PageSize);



        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _context.Groups.Include(x=>x.Connections).FirstOrDefaultAsync(x=>x.Name==groupName);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string SenderUsername,string RecepientUsername)
        {
            var messages = await _context.Messages
            .Where(m=>m.Recepient.UserName == SenderUsername && !m.RecepientDeleted && m.Sender.UserName == RecepientUsername 
            || m.Recepient.UserName == RecepientUsername && m.Sender.UserName == SenderUsername && !m.SenderDeleted)
            .MarkUnreadAsRead(SenderUsername)
            .OrderBy(ord=>ord.MessageSent)
            .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
            .ToListAsync();


            return messages;

        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

    }
}