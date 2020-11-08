using Api.Data;
using Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    public class UsersController : BaseApiController
    {
        public UsersController(
            DataContext context,
            ILogger<UsersController> logger) : base(context, logger)
        {
        }

        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns>All users</returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IEnumerable<AppUser>> GetUsers() =>
            await Context.Users.ToListAsync();

        /// <summary>
        /// Get a user
        /// </summary>
        /// <param name="id">Id of the user</param>
        /// <returns>Single user</returns>
        /// <response code="404">Requested user does not exist</response>
        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<AppUser> GetUser(Guid id) =>
            await Context.Users.FindAsync(id);
    }
}
