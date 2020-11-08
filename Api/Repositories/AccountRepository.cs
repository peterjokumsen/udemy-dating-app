using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Api.Data;
using Api.Entities;
using Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Api.Repositories
{
    public interface IAccountRepository
    {
        DataContext Context { get; }
        ITokenService TokenService { get; }

        Task<AppUser> FindUserAsync(string username);
        Task AddUserAsync(AppUser user);
        Task<bool> UserExistsAsync(string username);
        byte[] ComputeHash(string password, out byte[] salt);
        byte[] ComputeHash(string password, byte[] salt);
    }

    public class AccountRepository : IAccountRepository
    {
        private readonly ILogger<AccountRepository> _logger;

        public DataContext Context { get; }
        public ITokenService TokenService { get; }

        public AccountRepository(
            DataContext context,
            ITokenService tokenService,
            ILogger<AccountRepository> logger)
        {
            _logger = logger;
            Context = context;
            TokenService = tokenService;
        }

        public Task<AppUser> FindUserAsync(string username)
        {
            return Context.Users
                .SingleOrDefaultAsync(u => EF.Functions.Like(username, u.UserName));
        }

        public async Task AddUserAsync(AppUser user)
        {
            await Context.Users.AddAsync(user);
            await Context.SaveChangesAsync();
        }

        public Task<bool> UserExistsAsync(string username) =>
            Context.Users.AnyAsync(u => EF.Functions.Like(username, u.UserName));

        public byte[] ComputeHash(string password, out byte[] salt)
        {
            using (var hmac = new HMACSHA256())
            {
                salt = hmac.Key;
                return hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        public byte[] ComputeHash(string password, byte[] salt)
        {
            using (var hmac = new HMACSHA256(salt))
                return hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
    }
}
