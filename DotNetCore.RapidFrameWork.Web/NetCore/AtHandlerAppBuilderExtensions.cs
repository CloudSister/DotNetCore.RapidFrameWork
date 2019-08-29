using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotNetCore.RapidFrameWork.Web.NetCore
{
    public static class AtHandlerAppBuilderExtensions
    {
        public static IApplicationBuilder UseCcHandler(this IApplicationBuilder app)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }

            return app.UseMiddleware<AtHandlerMiddleware>();
        }
    }
}
