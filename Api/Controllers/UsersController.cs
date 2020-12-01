using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Dtos;
using Api.Entities;
using Api.Extensions;
using Api.Repositories;
using Api.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _repo;
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;

        public UsersController(
            IUserRepository repo,
            IPhotoService photoService,
            IMapper mapper,
            ILogger<UsersController> logger) : base(logger)
        {
            _repo = repo;
            _photoService = photoService;
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
        [HttpGet("{username}", Name = "GetUser")]
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
            var user = await _repo.GetUserByUsernameAsync(User.GetUsername());

            _mapper.Map(update, user);

            _repo.Update(user);
            if (await _repo.SaveAllAsync())
                return NoContent();

            return BadRequest(new { title = "Failed to update user." });
        }

        /// <summary>
        /// Upload new photo for logged in user.
        /// </summary>
        /// <param name="file">File to be saved</param>
        /// <returns>DTO of Photo</returns>
        /// <response code="400">Error occurred while saving file</response>
        [HttpPost("add-photo")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _repo.GetUserByUsernameAsync(User.GetUsername());
            var result = await _photoService.AddPhotoAsync(file);
            if (result.Error != null)
                return BadRequest(new { title = result.Error.Message });

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                IsMain = user.Photos.Count == 0,
            };

            user.Photos.Add(photo);

            if (await _repo.SaveAllAsync())
                return CreatedAtRoute("GetUser", new {username = user.UserName}, _mapper.Map<PhotoDto>(photo));

            return BadRequest(new { title = "Problem adding photo." });
        }

        /// <summary>
        /// Set photo as main.
        /// </summary>
        /// <param name="photoId"></param>
        /// <returns></returns>
        /// <response code="400">Failed to set photo as main</response>
        /// <response code="404">Photo specified was not found</response>
        [HttpPut("set-main-photo/{photoId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> SetMainPhoto(Guid photoId)
        {
            var user = await _repo.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null)
                return NotFound();

            if (photo.IsMain)
                return BadRequest(new {title = "This is already your main photo."});

            var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);
            if (currentMain != null)
                currentMain.IsMain = false;

            photo.IsMain = true;
            if (await _repo.SaveAllAsync())
                return NoContent();

            return BadRequest(new {title = "Failed to set main photo"});
        }

        /// <summary>
        /// Delete photo by id
        /// </summary>
        /// <param name="photoId"></param>
        /// <returns></returns>
        /// <response code="400">There was an error deleting the photo</response>
        /// <response code="404">Photo not found</response>
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(Guid photoId)
        {
            var user = await _repo.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null)
                return NotFound();

            if (photo.IsMain)
                return BadRequest(new {title = "Cannot delete main photo"});

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null)
                    return BadRequest(new {title = result.Error.Message});
            }

            user.Photos.Remove(photo);
            if (await _repo.SaveAllAsync())
                return Ok();

            return BadRequest(new {title = "Failed to delete photo"});
        }
    }
}
