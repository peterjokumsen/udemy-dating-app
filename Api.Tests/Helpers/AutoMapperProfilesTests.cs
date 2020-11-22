using Api.Helpers;
using AutoMapper;
using Xunit;

namespace Api.Tests.Helpers
{
    public class AutoMapperProfilesTests
    {
        private readonly IMapper _mapper;

        public AutoMapperProfilesTests()
        {
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile<AutoMapperProfiles>())
                .CreateMapper();
        }

        [Fact]
        public void ConfigIsValid()
        {
            _mapper.ConfigurationProvider.AssertConfigurationIsValid();
        }
    }
}
