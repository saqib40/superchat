using System.Text.Json;
using System.Text.Json.Serialization;

namespace backend.Services
{
    public class RecaptchaService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;
        private readonly bool _bypassRecaptcha;


        public RecaptchaService(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
            _bypassRecaptcha = config.GetValue<bool>("BYPASS_RECAPTCHA");

        }

        public async Task<bool> VerifyTokenAsync(string token, string expectedAction)
        {
            if (_bypassRecaptcha)
            {
                Console.WriteLine("Bypassing reCAPTCHA for testing.");
                return true;
            }
            var secret = _config["RECAPTCHA_SECRET_KEY"];
            if (string.IsNullOrWhiteSpace(secret))
            {
                Console.WriteLine("reCAPTCHA secret key is missing from config.");
                return false;
            }

            var client = _httpClientFactory.CreateClient();

            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("secret", secret),
                new KeyValuePair<string, string>("response", token)
            });

            var response = await client.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);
            var json = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"reCAPTCHA raw response: {json}");

            RecaptchaResponse? result = null;
            try
            {
                result = JsonSerializer.Deserialize<RecaptchaResponse>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Deserialization failed: {ex.Message}");
                return false;
            }

            if (result == null)
            {
                Console.WriteLine("Failed to parse reCAPTCHA response.");
                return false;
            }

            Console.WriteLine($"Parsed reCAPTCHA: Success={result.Success}, Score={result.Score}, Action={result.Action}");

            return result.Success && result.Action == expectedAction && result.Score >= 0.5;
        }

        private class RecaptchaResponse
        {
            [JsonPropertyName("success")]
            public bool Success { get; set; }

            [JsonPropertyName("action")]
            public string Action { get; set; }

            [JsonPropertyName("score")]
            public float Score { get; set; }

            [JsonPropertyName("challenge_ts")]
            public DateTime ChallengeTs { get; set; }

            [JsonPropertyName("hostname")]
            public string Hostname { get; set; }

            [JsonPropertyName("error-codes")]
            public List<string> ErrorCodes { get; set; }

        
        }
    }
}
