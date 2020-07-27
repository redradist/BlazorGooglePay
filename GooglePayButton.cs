using System;
using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace BlazorGooglePay
{
    public class GooglePayButton : IAsyncDisposable
    {
        protected internal IJSRuntime JsRuntime { get; set; }
        protected internal JsRuntimeObjectRef JsObjectRef { get; set; } = null!;

        public event Func<object, bool>? Clicked;
        
        internal GooglePayButton(IJSRuntime jsRuntime)
        {
            JsRuntime = jsRuntime;
        }

        public ValueTask AttachToAsync(ElementReference elemRef)
        {
            return JsRuntime.InvokeVoidAsync("blazorGooglePay.attachButton", elemRef, JsObjectRef);
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