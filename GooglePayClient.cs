using System;
using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.AspNetCore.Components;
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

        public GooglePayClient(IJSRuntime jsRuntime, JsRuntimeObjectRef jsObjectRef)
        {
            _jsRuntime = jsRuntime;
            _jsObjectRef = jsObjectRef;
        }

        public ValueTask<JsRuntimeObjectRef> CreateButtonAsync(GoogleButtonType type)
        {
            var callback = CallBackInteropWrapper.Create(
                OnGooglePaymentButtonClicked
            );
            return _jsRuntime.InvokeAsync<JsRuntimeObjectRef>(
                "createButton",
                _jsObjectRef,
                callback,
                "short");
        }

        public ValueTask AttachButtonAsync(JsRuntimeObjectRef jsObjectRef, ElementReference elemRef)
        {
            return _jsRuntime.InvokeVoidAsync(
                "attachButton",
                jsObjectRef,
                elemRef);
        }
        
        private async ValueTask OnGooglePaymentButtonClicked()
        {
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