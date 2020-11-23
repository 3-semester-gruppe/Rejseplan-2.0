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
