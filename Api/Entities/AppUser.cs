using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Entities
{
    [Table("User")]
    public class AppUser
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}
