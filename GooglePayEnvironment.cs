using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BlazorGooglePay
{
    [JsonConverter(typeof(GooglePayEnvironmentJsonConverter))]
    public enum GooglePayEnvironment
    {
        BlazorUnknownEnvironment,
        Test,
        Production,
    }
    
    public class GooglePayEnvironmentJsonConverter : JsonConverter<GooglePayEnvironment>
    {
        public override GooglePayEnvironment Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            switch(reader.GetString())
            {
                case "TEST":
                {
                    return GooglePayEnvironment.Test;
                }
                case "PRODUCTION":
                {
                    return GooglePayEnvironment.Production;
                }
                default:
                {
                    return GooglePayEnvironment.BlazorUnknownEnvironment;
                }
            }
        }

        public override void Write(Utf8JsonWriter writer, GooglePayEnvironment value, JsonSerializerOptions options)
        {
            string statusCodeString = "BLAZOR_UNKNOWN_ENVIRONMENT";
            switch (value)
            {
                case GooglePayEnvironment.Test:
                {
                    statusCodeString = "TEST";
                }
                    break;
                case GooglePayEnvironment.Production:
                {
                    statusCodeString = "PRODUCTION";
                }
                    break;
            }
            writer.WriteStringValue(statusCodeString);
        }
    }
}