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
        internal JsRuntimeObjectRef JsObjectRef { get; set; } = null!;

        internal GooglePayButton(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public ValueTask AttachToAsync(ElementReference elemRef)
        {
            return _jsRuntime.InvokeVoidAsync("blazorGooglePay.attachButton", elemRef, JsObjectRef);
        }
        
        public async ValueTask DisposeAsync()
        {
            await JsObjectRef.DisposeAsync();
        }
    }
}