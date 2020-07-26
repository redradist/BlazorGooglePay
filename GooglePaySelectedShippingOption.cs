namespace Blazor.GooglePay
{
    public class GooglePaySelectedShippingOption
    {
        public GooglePayShippingAddress Address { get; set; } = null!;
        public string SelectedShippingOptionId { get; set; } = null!;
    }
}