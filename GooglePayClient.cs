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
            var button = new GooglePayButton(_jsRuntime);
            var callback = CallBackInteropWrapper.Create(async () =>
            {
                await OnGooglePaymentButtonClicked(button);
            },
            serializationSpec: false);
            button.JsObjectRef = await _jsRuntime.InvokeAsync<JsRuntimeObjectRef>(
                "blazorGooglePay.createButton",
                _jsObjectRef,
                callback,
                type);
            return button;
        }
        
        private async ValueTask OnGooglePaymentButtonClicked(GooglePayButton button)
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