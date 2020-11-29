using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Controllers
{
    [ApiController, Produces("application/json")]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected ILogger Logger { get; }

        protected BaseApiController(ILogger logger)
        {
            Logger = logger;
        }
    }
}