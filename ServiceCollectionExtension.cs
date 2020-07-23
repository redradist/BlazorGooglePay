using Excubo.Blazor.ScriptInjection;
using Microsoft.Extensions.DependencyInjection;

namespace BlazorGooglePay
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddGooglePayment(this IServiceCollection services)
        {
            return services.AddScriptInjection();
        }
    }
}