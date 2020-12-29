using AutoMapper;

namespace Api.MappingProfiles
{
    public partial class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateAppUserAndMemberProfiles();
        }

        partial void CreateAppUserAndMemberProfiles();
    }
}
