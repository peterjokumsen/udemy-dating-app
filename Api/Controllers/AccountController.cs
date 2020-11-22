using System.Linq;
using System.Threading.Tasks;
using Api.Dtos;
using Api.Entities;
using Api.Repositories;
using Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Api.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IAccountRepository _repo;
        private readonly IOptions<ApiBehaviorOptions> _apiOptions;

        public AccountController(
            IAccountRepository repo,
            IOptions<ApiBehaviorOptions> apiOptions,
            ILogger<AccountController> logger) : base(logger)
        {
            _tokenService = repo.TokenService;
            _repo = repo;
            _apiOptions = apiOptions;
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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDto))]
        public async Task<IActionResult> Register(RegisterDto input)
        {
            if (await _repo.UserExistsAsync(input.Username))
            {
                ModelState.AddModelError(
                    nameof(input.Username),
                    $"Username '{input.Username}' already exists.");

                return _apiOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
            }

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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDto))]
        public async Task<IActionResult> Login(LoginDto input)
        {
            var user = await _repo.FindUserAsync(input.Username);

            var invalid = Unauthorized(new { title = "Invalid username and/or password" });
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
