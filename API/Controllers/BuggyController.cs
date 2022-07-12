using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        public BuggyController(DataContext context) : base(context)
        {

        }


        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> getSecret(){
            return "secret text";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> getNotFound(){
            var thing = _context.Users.Find(-1);
            if(thing==null){
                return NotFound();
            }

            return Ok(thing);
        }

        [HttpGet("server-error")]
        public ActionResult<string> getServerError(){
            var thing = _context.Users.Find(-1);
            var thingToReturn = thing.ToString();
            
            return thingToReturn;
        }

        [HttpGet("bad-request")]
        public ActionResult<string> getBadRequest(){
            return BadRequest("This was not a good request");
        }


    }
}