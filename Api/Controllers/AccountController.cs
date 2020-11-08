﻿using Api.Data;
using Api.DTOs;
using Api.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Api.Dtos;
using Api.Services;

namespace Api.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;

        public AccountController(
            ITokenService tokenService,
            DataContext context,
            ILogger<AccountController> logger) : base(context, logger)
        {
            _tokenService = tokenService;
        }

        private Task<bool> UserExists(string username) =>
            Context.Users.AnyAsync(u => EF.Functions.Like(username, u.UserName));

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
            if (await UserExists(input.Username))
                return BadRequest(new {Reason = $"Username '{input.Username}' already exists."});

            // TODO: try and hook into model validation instead
            //{
            //    ModelState.AddModelError(
            //        nameof(input.Username),
            //        $"Username '{input.Username}' already exists.");
            //
            //    throw new ArgumentException("hook into model state result?");
            //}

            using (var hmac = new HMACSHA256())
            {
                var user = new AppUser
                {
                    UserName = input.Username,
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input.Password)),
                    PasswordSalt = hmac.Key,
                };

                await Context.Users.AddAsync(user);
                await Context.SaveChangesAsync();

                return Ok(new UserDto
                {
                    Username = user.UserName,
                    Token = _tokenService.CreateToken(user),
                });
            }
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
            var user = await Context.Users
                .SingleOrDefaultAsync(u => EF.Functions.Like(input.Username, u.UserName));

            var invalid = Unauthorized(new { reason = "Invalid username and/or password" });
            if (user == null)
                return invalid;

            using (var hmac = new HMACSHA256(user.PasswordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input.Password));
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
}