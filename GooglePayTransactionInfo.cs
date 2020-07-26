using System.Collections.Generic;

namespace Blazor.GooglePay
{
    public class GooglePayTransactionInfo
    {
        public List<GooglePayDisplayItem> DisplayItems { get; set; } = new List<GooglePayDisplayItem>();
        public string? CountryCode { get; set; }
        public string? CurrencyCode { get; set; }
        public string? TotalPriceStatus { get; set; }
        public string? TotalPrice { get; set; }
        public string? TotalPriceLabel { get; set; }
    }
}