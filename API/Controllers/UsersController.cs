﻿using System.Security.Claims;
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
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            this._mapper = mapper;
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

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUserNameAsync(username);
            _mapper.Map(memberUpdateDto,user);
            _userRepository.Update(user);
            if(await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update user");

            
        }


    }
}
