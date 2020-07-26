namespace Blazor.GooglePay
{
    public struct GooglePayIsReadyToPayResponse
    {
        public bool Result { get; set; }
        public bool? PaymentMethodPresent { get; set; }
    }
}