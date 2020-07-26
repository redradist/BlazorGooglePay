namespace BlazorGooglePay
{
    public class GooglePaySelectedShippingOption
    {
        public GooglePayShippingAddress Address { get; set; } = null!;
        public string SelectedShippingOptionId { get; set; } = null!;
    }
}