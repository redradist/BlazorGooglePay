using System;
using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace GooglePayment
{
    public class GooglePay
    {
        private static IJSRuntime? _jsRuntime { set; get; }
        private static GooglePayClient? _client;

        public static void Init(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }
        
        public static async ValueTask<GooglePayClient> GetClientAsync()
        {
            if (_client != null)
            {
                return _client;
            }

            var jsObjRef = await _jsRuntime.InvokeAsync<JsRuntimeObjectRef>("getGooglePaymentsClient");
            Console.WriteLine($"jsObjRef.JsObjectRefId is {jsObjRef.JsObjectRefId}");
            _client = new GooglePayClient(_jsRuntime, jsObjRef);
            return _client; 
        }
    }
}