using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace BlazorGooglePay.Extensions
{
    public static class ElementReferenceExtension
    {
        public static ValueTask AppendChildAsync(this ElementReference elemRef, GooglePayButton button)
        {
            return button.JsRuntime.InvokeVoidAsync("blazorGooglePay.attachButton", elemRef, button.JsObjectRef);
        }
    }
}