using Api.Dtos;
using Api.Entities;
using Api.MappingProfiles;
using AutoMapper;
using Xunit;

namespace Api.Tests.MappingProfiles
{
    public class AutoMapperFixture
    {
        public IMapper Mapper { get; }

        public AutoMapperFixture()
        {
            Mapper = new MapperConfiguration(cfg => cfg.AddProfile<AutoMapperProfiles>())
                .CreateMapper();
        }
    }

    public class AutoMapperProfilesTests : IClassFixture<AutoMapperFixture>
    {
        private IMapper Mapper { get; }

        public AutoMapperProfilesTests(AutoMapperFixture fixture)
        {
            Mapper = fixture.Mapper;
        }

        [Fact]
        public void ConfigIsValid()
        {
            Mapper.ConfigurationProvider.AssertConfigurationIsValid();
        }

        [Fact]
        public void MapRegisterDtoToAppUser_SetsAtLeastOneValue()
        {
            var source = new RegisterDto { KnownAs = "john" };

            var result = Mapper.Map<AppUser>(source);

            Assert.Equal("john", result.KnownAs);
        }

        [Fact]
        public void MapUpdateMemberDtoToAppUser_SetsAtLeastOneValue()
        {
            var source = new MemberUpdateDto { City = "city" };

            var result = Mapper.Map<AppUser>(source);

            Assert.Equal("city", result.City);
        }
    }
}
