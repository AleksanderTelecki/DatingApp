using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        public UsersController(IUserRepository userRepository)
        {
            this._userRepository = userRepository;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetAppUsers()
        {
            var members = await _userRepository.GetMembersAsync();
            return Ok(members);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetAppUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }


    }
}
