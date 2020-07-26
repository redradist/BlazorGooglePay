using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BlazorGooglePay
{
    [JsonConverter(typeof(GooglePayStatusCodeJsonConverter))]
    public enum GooglePayStatusCode
    {
        BlazorUnknownStatusCode,
        Canceled,
        BuyerAccountError,
        DeveloperError,
        MerchantAccountError,
        InternalError,
    }
    
    public class GooglePayStatusCodeJsonConverter : JsonConverter<GooglePayStatusCode>
    {
        public override GooglePayStatusCode Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            switch(reader.GetString())
            {
                case "CANCELED":
                {
                    return GooglePayStatusCode.Canceled;
                }
                case "BUYER_ACCOUNT_ERROR":
                {
                    return GooglePayStatusCode.BuyerAccountError;
                }
                case "DEVELOPER_ERROR":
                {
                    return GooglePayStatusCode.DeveloperError;
                }
                case "MERCHANT_ACCOUNT_ERROR":
                {
                    return GooglePayStatusCode.MerchantAccountError;
                }
                case "INTERNAL_ERROR":
                {
                    return GooglePayStatusCode.InternalError;
                }
                default:
                {
                    return GooglePayStatusCode.BlazorUnknownStatusCode;
                }
            }
        }

        public override void Write(Utf8JsonWriter writer, GooglePayStatusCode value, JsonSerializerOptions options)
        {
            string statusCodeString = "BLAZOR_UNKNOWN_STATUS_CODE";
            switch (value)
            {
                case GooglePayStatusCode.Canceled:
                {
                    statusCodeString = "CANCELED";
                }
                    break;
                case GooglePayStatusCode.BuyerAccountError:
                {
                    statusCodeString = "BUYER_ACCOUNT_ERROR";
                }
                    break;
                case GooglePayStatusCode.DeveloperError:
                {
                    statusCodeString = "DEVELOPER_ERROR";
                }
                    break;
                case GooglePayStatusCode.MerchantAccountError:
                {
                    statusCodeString = "MERCHANT_ACCOUNT_ERROR";
                }
                    break;
                case GooglePayStatusCode.InternalError:
                {
                    statusCodeString = "INTERNAL_ERROR";
                }
                    break;
            }
            writer.WriteStringValue(statusCodeString);
        }
    }
}