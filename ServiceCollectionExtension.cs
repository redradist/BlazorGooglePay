using Excubo.Blazor.ScriptInjection;
using Microsoft.Extensions.DependencyInjection;

namespace GooglePayment
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddGooglePayment(this IServiceCollection services)
        {
            return services.AddScriptInjection();
        }
    }
}