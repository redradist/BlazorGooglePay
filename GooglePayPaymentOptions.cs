using System.Collections.Generic;

namespace BlazorGooglePay
{
    public class GooglePayPaymentOptions
    {
        public string[] CallbackIntents { get; set; } = null!;
        public bool? ShippingAddressRequired { get; set; }
        public GooglePayShippingAddressOptions? ShippingAddressParameters { get; set; }
        public bool? ShippingOptionRequired { get; set; }
    }
}