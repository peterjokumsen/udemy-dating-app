using AutoMapper;

namespace Api.Helpers
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
