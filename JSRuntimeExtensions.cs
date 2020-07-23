using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.JSInterop;

namespace BlazorGooglePay
{
    public static class JSRuntimeExtensions
    {
        private static GooglePayClient? _client;

        public static async ValueTask<GooglePayClient> GetGooglePayClientAsync(this IJSRuntime jsRuntime,
                                                                               GooglePayEnvironment env = GooglePayEnvironment.Test)
        {
            if (_client != null)
            {
                return _client;
            }

            var jsObjRef = await jsRuntime.InvokeAsync<JsRuntimeObjectRef>(
                "blazorGooglePay.getGooglePaymentsClient",
                env == GooglePayEnvironment.Test ? "TEST" : "PRODUCTION");
            _client = new GooglePayClient(jsRuntime, jsObjRef);
            return _client; 
        }
    }
}