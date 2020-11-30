using System.Linq;
using Api.Dtos;
using Api.Entities;
using Api.Extensions;

namespace Api.Helpers
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

            CreateMap<MemberUpdateDto, AppUser>();
        }
    }
}
