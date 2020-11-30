using System.Collections.Generic;
using System.Security.Claims;
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
        private readonly IMapper _mapper;

        public UsersController(
            IUserRepository repo,
            IMapper mapper,
            ILogger<UsersController> logger) : base(logger)
        {
            _repo = repo;
            _mapper = mapper;
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

        /// <summary>
        /// Update logged in user's basic details.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT api/users
        ///     {
        ///         "introduction": "about me",
        ///         "interests": "long walks",
        ///         "lookingFor": "fun",
        ///         "city": "Gotham",
        ///         "country": "A Country"
        ///     }
        ///
        /// </remarks>
        /// <param name="update">Model to use for updating user</param>
        /// <response code="204">Successful save</response>
        /// <response code="400">Failed to update user</response>
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto update)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _repo.GetUserByUsernameAsync(username);

            _mapper.Map(update, user);

            _repo.Update(user);
            if (await _repo.SaveAllAsync())
                return NoContent();

            return BadRequest(new { title = "Failed to update user." });
        }
    }
}
