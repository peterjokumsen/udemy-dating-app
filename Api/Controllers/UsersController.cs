using Api.Data;
using Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController, Produces("application/json")]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(DataContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns>All users</returns>
        [HttpGet]
        public async Task<IEnumerable<AppUser>> GetUsers() =>
            await _context.Users.ToListAsync();

        /// <summary>
        /// Get a user
        /// </summary>
        /// <param name="id">Id of the user</param>
        /// <returns>Single user</returns>
        /// <response code="404">Requested user does not exist</response>
        [HttpGet("{id:guid}")]
        public async Task<AppUser> GetUser(Guid id) =>
            await _context.Users.FindAsync(id);
    }
}
