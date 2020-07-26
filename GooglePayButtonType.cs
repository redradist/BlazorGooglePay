using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BlazorGooglePay
{
    [JsonConverter(typeof(GoogleButtonTypeJsonConverter))]
    public enum GoogleButtonType
    {
        BlazorUnknownButtonType,
        Long,
        Short,
    }

    public class GoogleButtonTypeJsonConverter : JsonConverter<GoogleButtonType>
    {
        public override GoogleButtonType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            switch(reader.GetString())
            {
                case "long":
                {
                    return GoogleButtonType.Long;
                }
                case "short":
                {
                    return GoogleButtonType.Short;
                }
                default:
                {
                    return GoogleButtonType.BlazorUnknownButtonType;
                }
            }
        }

        public override void Write(Utf8JsonWriter writer, GoogleButtonType value, JsonSerializerOptions options)
        {
            string statusCodeString = "BLAZOR_UNKNOWN_BUTTON_TYPE";
            switch (value)
            {
                case GoogleButtonType.Long:
                {
                    statusCodeString = "long";
                }
                    break;
                case GoogleButtonType.Short:
                {
                    statusCodeString = "short";
                }
                    break;
            }
            writer.WriteStringValue(statusCodeString);
        }
    }
}