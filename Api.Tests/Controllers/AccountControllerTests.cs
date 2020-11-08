using System.Threading.Tasks;
using Api.Controllers;
using Api.Dtos;
using Api.Entities;
using Api.Repositories;
using Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Api.Tests.Controllers
{
    public class AccountControllerTests
    {
        private readonly Mock<IAccountRepository> _repoMock = new Mock<IAccountRepository>();
        private readonly Mock<ITokenService> _tokenServiceMock = new Mock<ITokenService>();

        private AccountController Controller { get; }

        public AccountControllerTests()
        {
            _repoMock.SetupGet(m => m.TokenService).Returns(_tokenServiceMock.Object);

            Controller = new AccountController(
                _repoMock.Object,
                Mock.Of<ILogger<AccountController>>());
        }

        #region Register

        [Fact]
        public async Task Register_UsesExpectedMethods()
        {
            _repoMock.Setup(m => m.UserExistsAsync(It.IsAny<string>()))
                .ReturnsAsync(false);

            var salt = new byte[] { };
            var hash = new byte[] { };
            _repoMock.Setup(m => m.ComputeHash(It.IsAny<string>(), out salt))
                .Returns(hash);

            var createdUser = (AppUser) null;
            _repoMock.Setup(m => m.AddUserAsync(It.IsAny<AppUser>()))
                .Callback<AppUser>(a => createdUser = a)
                .Returns(Task.CompletedTask);

            _tokenServiceMock.Setup(m => m.CreateToken(It.IsAny<AppUser>()))
                .Returns("42");

            // ACT
            var response = await Controller.Register(new RegisterDto { Password = "p", Username = "u" });

            _repoMock.Verify(m => m.UserExistsAsync("u"));
            _repoMock.Verify(m => m.ComputeHash("p", out salt));

            Assert.Equal("u", createdUser.UserName);
            Assert.Same(salt, createdUser.PasswordSalt);
            Assert.Same(hash, createdUser.PasswordHash);

            _tokenServiceMock.Verify(m => m.CreateToken(createdUser));

            var actionResult = Assert.IsAssignableFrom<ObjectResult>(response);
            Assert.Equal(StatusCodes.Status200OK, actionResult.StatusCode);

            var result = Assert.IsType<UserDto>(actionResult.Value);
            Assert.Equal("42", result.Token);
            Assert.Equal("u", result.Username);
        }

        // TODO: Sad cases (most likely this implementation will change a lot in later sections)

        #endregion

        #region Login

        [Fact]
        public async Task Login_UsesExpectedMethods()
        {
            var salt = new byte[] { };
            var hash = new byte[] { 3 };
            var appUser = new AppUser
            {
                UserName = "john",
                PasswordSalt = salt,
                PasswordHash = hash,
            };

            _repoMock.Setup(m => m.FindUserAsync(It.IsAny<string>()))
                .ReturnsAsync(appUser);

            var computedHash = new byte[] { 3 };
            _repoMock.Setup(m => m.ComputeHash(It.IsAny<string>(), It.IsAny<byte[]>()))
                .Returns(computedHash);
            _tokenServiceMock.Setup(m => m.CreateToken(It.IsAny<AppUser>())).Returns("24");

            var dto = new LoginDto { Password = "p", Username = "u" };

            // ACT
            var response = await Controller.Login(dto);

            _repoMock.Verify(m => m.FindUserAsync("u"));
            _repoMock.Verify(m => m.ComputeHash("p", appUser.PasswordSalt));
            _tokenServiceMock.Verify(m => m.CreateToken(appUser));

            var actionResult = Assert.IsAssignableFrom<ObjectResult>(response);
            Assert.Equal(StatusCodes.Status200OK, actionResult.StatusCode);

            var result = Assert.IsType<UserDto>(actionResult.Value);
            Assert.Equal("john", result.Username);
            Assert.Equal("24", result.Token);
        }

        // TODO: Sad cases (most likely this implementation will change a lot in later sections)

        #endregion
    }
}
