using backend.Enums;

namespace backend.Helpers
{
    public static class CountryValidator
    {
        public static bool IsValidCountry(string country)
        {
            if (string.IsNullOrWhiteSpace(country)) return false;
            return Enum.TryParse(typeof(Country), country.Replace(" ", ""), ignoreCase: true, out _);
        }
    }
}


