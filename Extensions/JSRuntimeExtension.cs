using System;
using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.JSInterop;

namespace BlazorGooglePay.Extensions
{
    public static class JSRuntimeExtension
    {
        private class GooglePayShippingAddressJsInfo
        {
            public JsRuntimeObjectRef JsObjectRef { get; set; } = null!;
            public GooglePayShippingAddress? ShippingAddress { get; set; }
        }
        
        private class GooglePaySelectedShippingOptionJsInfo
        {
            public JsRuntimeObjectRef JsObjectRef { get; set; } = null!;
            public GooglePaySelectedShippingOption? SelectedShippingOption { get; set; }
        }
        
        private static GooglePayClient? _client;
        
        public static async ValueTask<GooglePayClient> GetGooglePayClientAsync(
            this IJSRuntime jsRuntime,
            GooglePayEnvironment? env = null,
            GooglePayMerchantInfo? merchantInfo = null,
            Func<string, ValueTask>? processPaymentCallback = null,
            Func<GooglePayShippingAddress, ValueTask<GooglePayDisplayShippingOptions>>? displayShippingOptionsCallback = null,
            Func<GooglePaySelectedShippingOption, ValueTask<GooglePayTransactionInfo>>? calculateTransactionInfoCallback = null)
        {
            if (_client != null)
            {
                return _client;
            }

            if (env == null)
            {
                env = GooglePayEnvironment.Test;
            }

            CallBackInteropWrapper? processPaymentCallbackWrapper = null;
            if (processPaymentCallback != null)
            {
                processPaymentCallbackWrapper = CallBackInteropWrapper.Create(async (string transactionToken) =>
                {
                    await processPaymentCallback(transactionToken);
                });
            }
            CallBackInteropWrapper? displayShippingOptionsCallbackWrapper = null;
            if (displayShippingOptionsCallback != null)
            {
                displayShippingOptionsCallbackWrapper = CallBackInteropWrapper.Create(async (GooglePayShippingAddressJsInfo shippingAddress) =>
                {
                    var displayShippingOptions = await displayShippingOptionsCallback(shippingAddress.ShippingAddress);
                    await jsRuntime.InvokeAsync<JsRuntimeObjectRef>(
                        "blazorGooglePay.setDisplayShippingOptions",
                        shippingAddress.JsObjectRef,
                        displayShippingOptions);
                });
            }
            CallBackInteropWrapper? calculateTransactionInfoCallbackWrapper = null;
            if (calculateTransactionInfoCallback != null)
            {
                calculateTransactionInfoCallbackWrapper = CallBackInteropWrapper.Create(async (GooglePaySelectedShippingOptionJsInfo selectedShippingOption) =>
                {
                    var calculateTransactionInfo = await calculateTransactionInfoCallback(selectedShippingOption.SelectedShippingOption);
                    await jsRuntime.InvokeAsync<JsRuntimeObjectRef>(
                        "blazorGooglePay.setCalculateTransactionInfo",
                        selectedShippingOption.JsObjectRef,
                        calculateTransactionInfo);
                });
            }
            var jsObjRef = await jsRuntime.InvokeAsync<JsRuntimeObjectRef>(
                "blazorGooglePay.getGooglePaymentsClient",
                env,
                merchantInfo,
                processPaymentCallbackWrapper,
                displayShippingOptionsCallbackWrapper,
                calculateTransactionInfoCallbackWrapper);
            _client = new GooglePayClient(jsRuntime, jsObjRef);
            return _client; 
        }
    }
}