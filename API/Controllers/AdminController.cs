using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController:BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        public AdminController(UserManager<AppUser> userManager, IMapper mapper, IUnitOfWork unitOfWork, IPhotoService photoService)
        {
            this._photoService = photoService;
            this._mapper = mapper;
            this._userManager = userManager;
            this._unitOfWork = unitOfWork;
            
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles(){
            var users = await _userManager.Users
            .Include(r => r.UserRoles)
            .ThenInclude(r => r.Role)
            .OrderBy(u=>u.UserName)
            .Select(u=>new {
                u.Id,
                UserName = u.UserName,
                Roles = u.UserRoles.Select(r=>r.Role.Name).ToList()
            }).ToListAsync();

            return Ok(users);
            
        }

        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles){
            var selectedRoles = roles.Split(',').ToArray();
            var user = await _userManager.FindByNameAsync(username);
            if (user==null)
            {
                return NotFound("Could not found user");
            }
            var userRoles = await _userManager.GetRolesAsync(user);
            var result = await _userManager.AddToRolesAsync(user,selectedRoles.Except(userRoles));
            if(!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user,userRoles.Except(selectedRoles));

             if(!result.Succeeded) return BadRequest("Failed to remove to roles");
            
            return Ok(await _userManager.GetRolesAsync(user)); 

        }

        [Authorize(Policy = "ModerateRole")]
        [HttpGet("users-to-moderate")]
        public async Task<ActionResult> GetUsersForModeration(){
            var users = await _userManager.Users
            .IgnoreQueryFilters()
            .Include(p=>p.Photos)
            .Select(u=>new {
                u.Id,
                UserName = u.UserName,
                PhotoUrl = u.Photos.Where(x=>x.IsMain).FirstOrDefault().Url
            }).ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "ModerateRole")]
        [HttpGet("users-to-moderate/{username}")]
        public async Task<ActionResult> GetUserForModeration(string username){
            var user = await _userManager.Users
            .IgnoreQueryFilters()
            .Where(x=>x.UserName == username)
            .Include(p => p.Photos)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();

            if (user==null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [Authorize(Policy = "ModerateRole")]
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){

            var user = await _unitOfWork.UserRepository.GetUserByUserNameAsync(memberUpdateDto.UserName);
            _mapper.Map(memberUpdateDto,user);
            _unitOfWork.UserRepository.Update(user);
            if(await _unitOfWork.Complete()) return NoContent();
            return BadRequest("Failed to update user");

        }

        [Authorize(Policy = "ModerateRole")]
        [HttpDelete("users-to-moderate/{username}")]
        public async Task<ActionResult> DeleteUser(string username){
            var user = await _userManager.Users
            .IgnoreQueryFilters()
            .Where(x=>x.UserName == username)
            .Include(p => p.Photos)
            .FirstOrDefaultAsync();

            if (user==null)
            {
                return NotFound();
            }

            _unitOfWork.UserRepository.DeleteUser(user);
            if(await _unitOfWork.Complete()){
                return Ok();
            }
            
            return BadRequest();
            
        }

        [Authorize(Policy = "ModerateRole")]
        [HttpDelete("users-to-moderate/photos/{photoId}")]
        public async Task<ActionResult> DeleteUserPhoto(int photoId){

            var photo = await _unitOfWork.PhotoRepository.GetPhotoWihoutQueryFilters(photoId);

            if (photo==null)
            {
                return NotFound();    
            }

            if (photo.IsMain)
            {
                return BadRequest("You cant't delete your main photo");
            }

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error!=null){
                    return BadRequest(result.Error.Message);
                }
            }
             
             _unitOfWork.PhotoRepository.DeletePhoto(photo);

            if(await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to delete photo");
        }


         [Authorize(Policy = "ModerateRole")]
         [HttpPatch("users-to-moderate/photos/")]
         public async Task<ActionResult> ApprovePhoto(PhotoApproveDto photoApproveDto){
            var user = await _userManager.Users
            .IgnoreQueryFilters()
            .Where(x=>x.UserName == photoApproveDto.UserName)
            .Include(p => p.Photos).FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            var photo = user.Photos.FirstOrDefault(x=>x.Id==photoApproveDto.PhotoId);

            if (photo==null)
            {
                return NotFound();
            }

            photo.IsApproved = true;

            if (user.Photos.Count == 1)
            {
                photo.IsMain = true;
            }

            if(await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to delete photo");


         }
        



    }
}