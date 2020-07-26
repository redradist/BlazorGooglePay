using System.Collections.Generic;

namespace BlazorGooglePay
{
    public class GooglePayDisplayShippingOptions
    {
        public string? DefaultSelectedOptionId { get; set; }
        public List<GooglePayShippingOption> ShippingOptions { get; set; } = null!;
    }
}