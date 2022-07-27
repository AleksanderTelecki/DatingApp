using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;
        public PhotoRepository(DataContext context)
        {
            this._context = context;
        }

        public void DeletePhoto(Photo photo)
        {
            _context.Photos.Remove(photo);
        }

        public async Task<Photo> GetPhotoWihoutQueryFilters(int photoId)
        {
            return await _context.Photos.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == photoId);
        }
    }
}