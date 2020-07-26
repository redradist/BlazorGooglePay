using System.Collections.Generic;

namespace Blazor.GooglePay
{
    public class GooglePayDisplayShippingOptions
    {
        public string? DefaultSelectedOptionId { get; set; }
        public List<GooglePayShippingOption> ShippingOptions { get; set; } = null!;
    }
}