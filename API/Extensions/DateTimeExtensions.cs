using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime birthdate){
            
            var today = DateTime.Today.ToUniversalTime();
            var age = today.Year - birthdate.Year;
            if (birthdate.Date > today.AddYears(-age)) age--;

            return age;
        }

    }
}