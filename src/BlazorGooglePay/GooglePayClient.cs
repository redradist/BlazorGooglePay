using System;
using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.JSInterop;

namespace BlazorGooglePay
{
    public class GooglePayClient : IAsyncDisposable
    {
        protected internal IJSRuntime _jsRuntime;
        protected internal JsRuntimeObjectRef _jsObjectRef;
        
        public event Func<object, GooglePayButton, ValueTask<bool>>? ButtonClicked;
        
        internal GooglePayClient(IJSRuntime jsRuntime, JsRuntimeObjectRef jsObjectRef)
        {
            _jsRuntime = jsRuntime;
            _jsObjectRef = jsObjectRef;
        }

        public async ValueTask<GooglePayButton> CreateButtonAsync(GoogleButtonType type,
                                                                  GooglePayButtonColor? color = null)
        {
            var button = new GooglePayButton(_jsRuntime, type, color);
            var callback = CallBackInteropWrapper.Create(async () =>
            {
                var isHandled = await OnButtonClicked(button);
                if (!isHandled)
                {
                    await button.OnClicked();
                }
            },
            serializationSpec: false);
            button.JsObjectRef = await _jsRuntime.InvokeAsync<JsRuntimeObjectRef>(
                "blazorGooglePay.createButton",
                _jsObjectRef,
                callback,
                type,
                color);
            return button;
        }
        
        public ValueTask<GooglePayIsReadyToPayResponse> IsReadyToPayAsync()
        {
            return _jsRuntime.InvokeAsync<GooglePayIsReadyToPayResponse>(
                "blazorGooglePay.isReadyToPay",
                _jsObjectRef);
        }
        
        public ValueTask PrefetchGooglePaymentDataAsync(string currencyCode)
        {
            return _jsRuntime.InvokeVoidAsync(
                "blazorGooglePay.prefetchGooglePaymentData",
                _jsObjectRef,
                currencyCode);
        }

        public ValueTask SetAllowedAuthMethodsAsync(params string[] authMethods)
        {
            return _jsRuntime.InvokeVoidAsync(
                "blazorGooglePay.setAllowedAuthMethods",
                _jsObjectRef,
                authMethods);
        }
        
        public ValueTask<string[]> GetAllowedAuthMethodsAsync()
        {
            return _jsRuntime.InvokeAsync<string[]>(
                "blazorGooglePay.getAllowedAuthMethods",
                _jsObjectRef);
        }
        
        public ValueTask SetAllowedCardNetworksAsync(params string[] cardNetworks)
        {
            return _jsRuntime.InvokeVoidAsync(
                "blazorGooglePay.setAllowedCardNetworks",
                _jsObjectRef,
                cardNetworks);
        }

        public ValueTask<string[]> GetAllowedCardNetworksAsync()
        {
            return _jsRuntime.InvokeAsync<string[]>(
                "blazorGooglePay.getAllowedCardNetworks",
                _jsObjectRef);
        }
        
        public ValueTask<GooglePayGatewayInfo> GetGatewayInfoAsync()
        {
            return _jsRuntime.InvokeAsync<GooglePayGatewayInfo>(
                "blazorGooglePay.getGatewayInfo",
                _jsObjectRef);
        }
        
        public ValueTask SetGatewayInfoAsync(GooglePayGatewayInfo gatewayInfo)
        {
            return _jsRuntime.InvokeVoidAsync(
                "blazorGooglePay.setGatewayInfo",
                _jsObjectRef,
                gatewayInfo);
        }
        
        public ValueTask<GooglePayMerchantInfo> GetMerchantInfoAsync()
        {
            return _jsRuntime.InvokeAsync<GooglePayMerchantInfo>(
                "blazorGooglePay.getMerchantInfo",
                _jsObjectRef);
        }
        
        public ValueTask SetMerchantInfoAsync(GooglePayMerchantInfo merchantInfo)
        {
            return _jsRuntime.InvokeVoidAsync(
                "blazorGooglePay.setMerchantInfo",
                _jsObjectRef,
                merchantInfo);
        }
        
        public ValueTask<string?> LoadPaymentAsync(
            GooglePayTransactionInfo tranInfo,
            GooglePayPaymentOptions? paymentOptions = null)
        {
            return _jsRuntime.InvokeAsync<string?>(
                "blazorGooglePay.loadPaymentData",
                _jsObjectRef,
                tranInfo,
                paymentOptions);
        }
        
        protected virtual async ValueTask<bool> OnButtonClicked(GooglePayButton button)
        {
            if (ButtonClicked?.GetInvocationList() != null)
            {
                foreach (var handler in ButtonClicked?.GetInvocationList()!)
                {
                    var isHandled = (bool) handler.DynamicInvoke(this, button);
                    if (isHandled)
                    {
                        return isHandled;
                    }
                }
            }
            return false;
        }

        public async ValueTask DisposeAsync()
        {
            await _jsObjectRef.DisposeAsync();
            ButtonClicked = null;
        }
    }
}