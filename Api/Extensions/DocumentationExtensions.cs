using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace Api.Extensions
{
    // TODO: Update to document and use authorization
    public static class DocumentationExtensions
    {
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Udemy Dating App API",
                });

                var dllFile = typeof(Startup).Assembly.Location;
                var xmlPath = dllFile.Replace("dll", "xml");

                c.IncludeXmlComments(xmlPath);
            });

            return services;
        }

        public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Udemy Dating App API V1");
                c.RoutePrefix = "swagger";
                c.DocExpansion(DocExpansion.None);
            });

            return app;
        }
    }
}
