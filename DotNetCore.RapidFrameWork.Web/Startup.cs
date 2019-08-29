using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

namespace DotNetCore.RapidFrameWork.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        //跨域策略名称
        private string crosPolicyName = "allow-specific-originals";

        /// <summary>
        /// 配置服务将服务注册到依赖注入容器中。
        /// 在Configure()之前执行。
        /// </summary>
        public void ConfigureServices(IServiceCollection services)
        {
            // 理解跨域配置，请参考 https://docs.microsoft.com/zh-cn/aspnet/core/security/cors?view=aspnetcore-3.0
            services.AddCors(options =>
            {
                options.AddPolicy(crosPolicyName,
                builder =>
                {
                    builder.WithOrigins("http://localhost:8000",
                                        "https://localhost:8000") // 指定前端地址
                    .AllowAnyHeader() // 用于支持http头中带token的认证
                    .AllowAnyMethod() // 跨域时，浏览器会发一个OPTIONS请求，这儿也可以用.WithHeaders来指定具体的Http方法
                    .SetPreflightMaxAge(TimeSpan.FromDays(1)) // 将预检请求的结果缓存, 即设置Access-Control-Max-Age头
                    .AllowCredentials(); // 设置 Access-Control-Allow-Credentials 标头
                });
            });

            // Session默认用的是DistributedMemory
            services.AddDistributedMemoryCache();

            // 用于类库中访问HttpContext
            // 等价于services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddHttpContextAccessor();

            // 配置cookie (不跨域可以不配)
            services.Configure<CookiePolicyOptions>(options =>
            {
                // 因为asp.net core 2.1 开始遵循欧盟GDPR规则，所以需要启用下面的两个配置
                // 参考文章https://andrewlock.net/session-state-gdpr-and-non-essential-cookies/
                // 是否需要用户手动确认接受cookie，配置为false，表示不需要用户确认
                options.CheckConsentNeeded = context => false;
                options.MinimumSameSitePolicy = SameSiteMode.None;
                // options.SameSite = SameSiteMode.None; 
            });

            //Session服务
            services.AddSession(options =>
            {
                options.Cookie.IsEssential = true; // 不跨域可以不配
                options.Cookie.SameSite = SameSiteMode.None;

                options.IdleTimeout = TimeSpan.FromHours(24);
                options.IOTimeout = TimeSpan.FromSeconds(5);
            });

            // 解决异常：System.InvalidOperationException: Synchronous operations are disallowed. Call WriteAsync or set AllowSynchronousIO to true instead.
            // 原因参见： https://github.com/aspnet/AspNetCore/issues/8302
            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });


            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            // 跨域
            app.UseCors(crosPolicyName);

            // 使用静态文件访问
            //app.UseStaticFiles(new StaticFileOptions()
            //{
            //    FileProvider = new PhysicalFileProvider(Directory.GetCurrentDirectory()),
            //});

            app.UseFileServer();

            // 使用Session
            app.UseSession();

            app.UseCookiePolicy();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Login}/{id?}");
            });

        }
    }
}
