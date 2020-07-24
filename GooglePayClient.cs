using System;
using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.JSInterop;

namespace BlazorGooglePay
{
    public class GooglePayClient : IAsyncDisposable
    {
        private IJSRuntime _jsRuntime;
        private JsRuntimeObjectRef _jsObjectRef;

        internal GooglePayClient(IJSRuntime jsRuntime, JsRuntimeObjectRef jsObjectRef)
        {
            _jsRuntime = jsRuntime;
            _jsObjectRef = jsObjectRef;
        }

        public async ValueTask<GooglePayButton> CreateButtonAsync(GoogleButtonType type)
        {
            Console.WriteLine("CreateButtonAsync");
            var callback = CallBackInteropWrapper.Create(OnGooglePaymentButtonClicked);
            var buttonJsObjectRef = await _jsRuntime.InvokeAsync<JsRuntimeObjectRef>(
                "blazorGooglePay.createButton",
                _jsObjectRef,
                callback,
                type);
            return new GooglePayButton(_jsRuntime, buttonJsObjectRef);
        }
        
        private async ValueTask OnGooglePaymentButtonClicked()
        {
            Console.WriteLine("OnGooglePaymentButtonClicked");
        }
        
        public ValueTask<GooglePayIsReadyToPayResponse> IsReadyToPayAsync()
        {
            return _jsRuntime.InvokeAsync<GooglePayIsReadyToPayResponse>(
                "blazorGooglePay.isReadyToPay",
                _jsObjectRef);
        }
        
        public async ValueTask DisposeAsync()
        {
            await _jsObjectRef.DisposeAsync();
        }
    }
}