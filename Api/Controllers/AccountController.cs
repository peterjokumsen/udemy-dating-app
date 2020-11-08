using System.Linq;
using System.Threading.Tasks;
using Api.Dtos;
using Api.Entities;
using Api.Repositories;
using Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IAccountRepository _repo;

        public AccountController(
            IAccountRepository repo,
            ILogger<AccountController> logger) : base(repo.Context, logger)
        {
            _tokenService = repo.TokenService;
            _repo = repo;
        }

        /// <summary>
        /// Register new user
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST account/register
        ///     {
        ///         "username": "John",
        ///         "password": "let-me-in"
        ///     }
        ///
        /// </remarks>
        /// <param name="input"></param>
        /// <returns>Created user</returns>
        /// <response code="400">Invalid input received or username exists</response>
        [HttpPost("register")]
        // If use model validation, can revert to return AppUser in definition and not have this:
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDto))]
        public async Task<IActionResult> Register(RegisterDto input)
        {
            if (await _repo.UserExistsAsync(input.Username))
                return BadRequest(new {Reason = $"Username '{input.Username}' already exists."});

            // TODO: try and hook into model validation instead
            //{
            //    ModelState.AddModelError(
            //        nameof(input.Username),
            //        $"Username '{input.Username}' already exists.");
            //
            //    throw new ArgumentException("hook into model state result?");
            //}

            var hash = _repo.ComputeHash(input.Password, out var salt);
            var user = new AppUser
            {
                UserName = input.Username,
                PasswordHash = hash,
                PasswordSalt = salt,
            };

            await _repo.AddUserAsync(user);

            return Ok(new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
            });
        }

        /// <summary>
        /// Login
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST account/login
        ///     {
        ///         "username": "John",
        ///         "password": "let-me-in"
        ///     }
        ///
        /// </remarks>
        /// <param name="input"></param>
        /// <returns>Logged in user</returns>
        /// <response code="401">Invalid username and/or password</response>
        [HttpPost("login")]
        // If use model validation, can revert to return AppUser in definition and not have this:
        // although, might need to keep as not returning BadRequest here.
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDto))]
        public async Task<IActionResult> Login(LoginDto input)
        {
            var user = await _repo.FindUserAsync(input.Username);

            var invalid = Unauthorized(new { reason = "Invalid username and/or password" });
            if (user == null)
                return invalid;

            var computedHash = _repo.ComputeHash(input.Password, user.PasswordSalt);
            var compares = computedHash
                .Select((b, i) => user.PasswordHash.Length >= i && b == user.PasswordHash[i]);

            if (compares.Any(c => !c))
                return invalid;

            return Ok(new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
            });
        }
    }
}
