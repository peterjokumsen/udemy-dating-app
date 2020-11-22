using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Controllers
{
    public class BuggyController : BaseApiController
    {
        public BuggyController(
            ILogger<BuggyController> logger) : base(logger)
        {
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "secret text";
        }

        [HttpGet("not-found")]
        public ActionResult<string> GetNotFound()
        {
            return null;
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            throw new NullReferenceException();
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest(new { title = "not good" });
        }
    }
}
