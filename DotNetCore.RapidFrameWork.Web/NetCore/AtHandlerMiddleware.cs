using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotNetCore.RapidFrameWork.Web.NetCore
{
    public class AtHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AtHandlerMiddleware> _logger;

        /// <summary>
        /// 构造方法。
        /// 注：参数都是注入的。
        /// </summary>
        /// <param name="next"></param>
        /// <param name="optionsAccessor"></param>
        /// <param name="dataProtectionProvider"></param>
        /// <remarks>2019-7-29 zl</remarks>
        public AtHandlerMiddleware(RequestDelegate next, ILogger<AtHandlerMiddleware> logger)
        {
            if (next == null)
            {
                throw new ArgumentNullException(nameof(next));
            }
            _next = next;
            _logger = logger;
        }

        /// <summary>
        /// Invokes the logic of the middleware.
        /// </summary>
        /// <param name="context">The <see cref="HttpContext"/>.</param>
        /// <returns>A <see cref="Task"/> that completes when the middleware has completed processing.</returns>
        public async Task Invoke(HttpContext context)
        {
            if (context.Response.HasStarted)
                return;

            string path = context.Request.Path;

            // 其他资源，比如htm、js、jpg等文件
            await _next(context);
        }

    }
}
