using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace RejseplanenAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //InMemory database
            services.AddDbContext<RejseplanenContext>(opt => opt.UseInMemoryDatabase("RejseplanenList"));

            //MiddleWare with policies
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAnyOrigin", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
                options.AddPolicy("AllowSpecificOrigin", builder => builder.WithOrigins("https://localhost:3000").AllowAnyMethod().AllowAnyHeader());
                options.AddPolicy("AllowAnyOriginGetPost", builder => builder.AllowAnyOrigin().WithMethods("GET", "POST").AllowAnyHeader());
                options.AddPolicy("AllowSpecificOriginGetPost", builder => builder.WithOrigins("https://localhost:3000").WithMethods("GET", "POST").AllowAnyHeader());
            });

            //Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Rejseplanen v2.0 API",
                    Version = "v1.0",
                    Description = "OpenAPI for api/Libraries",
                    //TermsOfService = new Uri("none"),
                    Contact = new OpenApiContact
                    {
                        Name = "Alexander, Jonas, Jonas, Henrik & Nicklas",
                        Email = "",
                        //Url = new Uri(string.Empty)
                    },
                    License = new OpenApiLicense
                    {
                        Name = "No license required",
                        //Url = new Uri(string.Empty)
                    }
                });

                //var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                //var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                //c.IncludeXmlComments(xmlPath);
            });

            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            //Swagger
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Rejseplanen v2.0 API");
                c.RoutePrefix = "api/help";
            });

            //Cors
            app.UseCors("AllowAnyOrigin");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
