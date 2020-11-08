using Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Controllers
{
    [ApiController, Produces("application/json")]
    [Route("[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected DataContext Context { get; }
        protected ILogger Logger { get; }

        protected BaseApiController(DataContext context, ILogger logger)
        {
            Context = context;
            Logger = logger;
        }
    }
}