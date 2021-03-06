using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            this._mapper = mapper;
            this._context = context;
            
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUserNameAsync(string username)
        {
            return await _context.Users
                .Include(p=>p.Photos)
                .SingleOrDefaultAsync(user => user.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                .Include(p=>p.Photos)
                .ToListAsync();
        }

        public void Update(AppUser user)
        {
           _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<MemberDto> GetMemberAsync(string username,string callerUserName)
        {   
            if(username == callerUserName){
                return await _context.Users.IgnoreQueryFilters()
                .Where(x=>x.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
            }
            
            return await _context.Users.Where(x=>x.UserName == username).ProjectTo<MemberDto>(_mapper.ConfigurationProvider).SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();
            query = query.Where(u => u.UserName != userParams.CurrentUserName);
            query = query.Where(u=>u.Gender==userParams.Gender);
            var minDob = DateTime.Today.AddYears(-userParams.MaxAge -1).ToUniversalTime();
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge).ToUniversalTime();

            query = query.Where(u => u.DateOfBirth>=minDob && u.DateOfBirth<=maxDob);

            query = userParams.OrderBy switch
            {
                "createdAt"=>query.OrderByDescending(u => u.CreatedAt),
                _ =>query.OrderByDescending(u => u.LastActive),
            };


            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).AsNoTracking(),userParams.PageNumber,userParams.PageSize);
        }

        public async Task<string> GetUserGender(string username)
        {
            return await _context.Users.Where(x=>x.UserName==username).Select(x=>x.Gender).FirstOrDefaultAsync();
        }

        public void DeleteUser(AppUser appUser)
        {
            _context.Users.Remove(appUser);
        }

        public async Task<IEnumerable<Photo>> GetPhotosForUserWithoutQueryFilters(string username)
        {
            var user = await _context.Users.IgnoreQueryFilters()
            .Include(p=>p.Photos)
            .SingleOrDefaultAsync(user => user.UserName == username);
            return user.Photos;
        }
    }
}