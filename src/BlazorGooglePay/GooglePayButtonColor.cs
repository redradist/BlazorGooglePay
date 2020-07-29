using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BlazorGooglePay
{
    [JsonConverter(typeof(GooglePayButtonColorJsonConverter))]
    public enum GooglePayButtonColor
    {
        Default,
        Black,
        White,
    }
    
    public class GooglePayButtonColorJsonConverter : JsonConverter<GooglePayButtonColor>
    {
        public override GooglePayButtonColor Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            switch(reader.GetString())
            {
                case "black":
                {
                    return GooglePayButtonColor.Black;
                }
                case "white":
                {
                    return GooglePayButtonColor.White;
                }
                default:
                {
                    return GooglePayButtonColor.Default;
                }
            }
        }

        public override void Write(Utf8JsonWriter writer, GooglePayButtonColor value, JsonSerializerOptions options)
        {
            string statusCodeString = "BLAZOR_UNKNOWN_BUTTON_TYPE";
            switch (value)
            {
                case GooglePayButtonColor.Black:
                {
                    statusCodeString = "black";
                }
                    break;
                case GooglePayButtonColor.White:
                {
                    statusCodeString = "white";
                }
                    break;
                default:
                {
                    statusCodeString = "default";
                }
                    break;
            }
            writer.WriteStringValue(statusCodeString);
        }
    }
}