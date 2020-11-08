using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Api.Filters
{
    // Source: https://www.strathweb.com/2018/10/convert-null-valued-results-to-404-in-asp-net-core-mvc/
    public class NotFoundResultFilterConvention : IControllerModelConvention
    {
        public void Apply(ControllerModel controller)
        {
            if (IsApiController(controller))
                controller.Filters.Add(new NotFoundResultFilterAttribute());
        }

        private static bool IsApiController(ControllerModel controller)
        {
            // [ApiController] implements IApiBehaviorMetadata
            return controller.Attributes.OfType<IApiBehaviorMetadata>().Any()
                || controller.ControllerType.Assembly
                    .GetCustomAttributes()
                    .OfType<IApiBehaviorMetadata>()
                    .Any();
        }
    }
}