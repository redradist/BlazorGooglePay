using System;
using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace BlazorGooglePay
{
    public class GooglePayButton : IAsyncDisposable
    {
        private IJSRuntime _jsRuntime;
        private JsRuntimeObjectRef _jsObjectRef;
        
        internal GooglePayButton(IJSRuntime jsRuntime, JsRuntimeObjectRef jsObjectRef)
        {
            _jsRuntime = jsRuntime;
            _jsObjectRef = jsObjectRef;
        }

        public ValueTask AttachToAsync(ElementReference elemRef)
        {
            return _jsRuntime.InvokeVoidAsync("blazorGooglePay.attachButton", elemRef, _jsObjectRef);
        }
        
        private async ValueTask OnClicked()
        {
            
        }
        
        public async ValueTask DisposeAsync()
        {
            await _jsObjectRef.DisposeAsync();
        }
    }
}