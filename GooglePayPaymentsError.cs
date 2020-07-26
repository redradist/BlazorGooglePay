namespace Blazor.GooglePay
{
    public class GooglePayPaymentsError
    {
        private GooglePayStatusCode StatusCode { get; set; }
        private string StatusMessage { get; set; } = null!;
    }
}