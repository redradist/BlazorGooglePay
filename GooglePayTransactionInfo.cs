using System.Collections.Generic;

namespace BlazorGooglePay
{
    public class GooglePayTransactionInfo
    {
        public List<GooglePayDisplayItem>? DisplayItems { get; set; } 
        public double? CountryCode { get; set; }
        public string? CurrencyCode { get; set; }
        public string? TotalPriceStatus { get; set; }
        public double? TotalPrice { get; set; }
        public string? TotalPriceLabel { get; set; }
    }
}