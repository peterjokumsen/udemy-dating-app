using System.Linq;
using Api.Dtos;
using Api.Entities;
using Api.Extensions;

namespace Api.MappingProfiles
{
    public partial class AutoMapperProfiles
    {
        partial void CreateAppUserAndMemberProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(
                    d => d.PhotoUrl,
                    opt => opt.MapFrom(s => s.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(d => d.Age, opt => opt.MapFrom(s => s.DateOfBirth.CalculateAge()));

            CreateMap<Photo, PhotoDto>();

            CreateMap<MemberUpdateDto, AppUser>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.UserName, opt => opt.Ignore())
                .ForMember(d => d.PasswordHash, opt => opt.Ignore())
                .ForMember(d => d.PasswordSalt, opt => opt.Ignore())
                .ForMember(d => d.DateOfBirth, opt => opt.Ignore())
                .ForMember(d => d.KnownAs, opt => opt.Ignore())
                .ForMember(d => d.Created, opt => opt.Ignore())
                .ForMember(d => d.LastActive, opt => opt.Ignore())
                .ForMember(d => d.Gender, opt => opt.Ignore())
                .ForMember(d => d.Photos, opt => opt.Ignore());

            CreateMap<RegisterDto, AppUser>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.PasswordHash, opt => opt.Ignore())
                .ForMember(d => d.PasswordSalt, opt => opt.Ignore())
                .ForMember(d => d.Created, opt => opt.Ignore())
                .ForMember(d => d.LastActive, opt => opt.Ignore())
                .ForMember(d => d.Introduction, opt => opt.Ignore())
                .ForMember(d => d.LookingFor, opt => opt.Ignore())
                .ForMember(d => d.Interests, opt => opt.Ignore())
                .ForMember(d => d.Photos, opt => opt.Ignore());
        }
    }
}
