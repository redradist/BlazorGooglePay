using System;
using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.JSInterop;

namespace GooglePayment
{
    public struct ReadyToPayResponse
    {
        public bool Result { get; set; }
    }
    
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
            var callback = CallBackInteropWrapper.Create(OnGooglePaymentButtonClicked);
            var buttonJsObjectRef = await _jsRuntime.InvokeAsync<JsRuntimeObjectRef>(
                "createButton",
                _jsObjectRef,
                callback,
                type == GoogleButtonType.Long ? "long" : "short");
            return new GooglePayButton(_jsRuntime, buttonJsObjectRef);
        }
        
        private async ValueTask OnGooglePaymentButtonClicked()
        {
            Console.WriteLine("OnGooglePaymentButtonClicked");
        }
        
        public async ValueTask DisposeAsync()
        {
            await _jsObjectRef.DisposeAsync();
        }

        public ValueTask<ReadyToPayResponse> IsReadyToPayAsync()
        {
            return _jsRuntime.InvokeAsync<ReadyToPayResponse>(
                "isReadyToPay",
                _jsObjectRef);
        }
    }
}