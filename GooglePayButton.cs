using System;
using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Blazor.GooglePay
{
    public class GooglePayButton : IAsyncDisposable
    {
        private IJSRuntime _jsRuntime;
        internal JsRuntimeObjectRef JsObjectRef { get; set; } = null!;

        public event Func<object, bool>? Clicked;
        
        internal GooglePayButton(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public ValueTask AttachToAsync(ElementReference elemRef)
        {
            return _jsRuntime.InvokeVoidAsync("blazorGooglePay.attachButton", elemRef, JsObjectRef);
        }

        internal async ValueTask OnClicked()
        {
            if (Clicked?.GetInvocationList() != null)
            {
                foreach (var handler in Clicked?.GetInvocationList()!)
                {
                    var isHandled = (bool) handler.DynamicInvoke(this);
                    if (isHandled)
                    {
                        return;
                    }
                }
            }
        }
        
        public async ValueTask DisposeAsync()
        {
            await JsObjectRef.DisposeAsync();
            Clicked = null;
        }
    }
}