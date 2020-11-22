using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Dtos;
using Api.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _repo;

        public UsersController(
            IUserRepository repo,
            ILogger<UsersController> logger) : base(logger)
        {
            _repo = repo;
        }

        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns>All users</returns>
        [HttpGet]
        public async Task<IEnumerable<MemberDto>> GetUsers()
        {
            return await _repo.GetMembersAsync();
        }

        /// <summary>
        /// Get a user
        /// </summary>
        /// <param name="username">Username of the user</param>
        /// <returns>Single user</returns>
        /// <response code="404">Requested user does not exist</response>
        [HttpGet("{username}")]
        public async Task<MemberDto> GetUser(string username)
        {
            return await _repo.GetMemberByUsernameAsync(username);
        }
    }
}
