using System;
using System.Threading.Tasks;
using BrowserInterop.Extensions;
using Microsoft.JSInterop;

namespace BlazorGooglePay.Extensions
{
    public static class JSRuntimeExtension
    {
        private static GooglePayClient? _client;
        
        public static async ValueTask<GooglePayClient> GetGooglePayClientAsync(
            this IJSRuntime jsRuntime,
            GooglePayEnvironment? env = null,
            GooglePayMerchantInfo? merchantInfo = null,
            Func<string, ValueTask>? processPaymentCallback = null,
            Func<GooglePayShippingAddress, ValueTask<GooglePayDisplayShippingOptions>>? getDisplayShippingOptionsCallback = null,
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
            CallBackInteropWrapper? getDisplayShippingOptionsCallbackWrapper = null;
            if (getDisplayShippingOptionsCallback != null)
            {
                getDisplayShippingOptionsCallbackWrapper = CallBackInteropWrapper.CreateWithResult(
                    (GooglePayShippingAddress? shippingAddress) => getDisplayShippingOptionsCallback(shippingAddress)
                );
            }
            CallBackInteropWrapper? calculateTransactionInfoCallbackWrapper = null;
            if (calculateTransactionInfoCallback != null)
            {
                calculateTransactionInfoCallbackWrapper = CallBackInteropWrapper.CreateWithResult(
                    (GooglePaySelectedShippingOption? selectedShippingOption) => calculateTransactionInfoCallback(selectedShippingOption));
            }
            var jsObjRef = await jsRuntime.InvokeAsync<JsRuntimeObjectRef>(
                "blazorGooglePay.getGooglePaymentsClient",
                env,
                merchantInfo,
                processPaymentCallbackWrapper,
                getDisplayShippingOptionsCallbackWrapper,
                calculateTransactionInfoCallbackWrapper);
            _client = new GooglePayClient(jsRuntime, jsObjRef);
            return _client; 
        }
    }
}