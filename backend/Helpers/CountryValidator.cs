using backend.Models;

namespace backend.Helpers
{
    public static class CountryValidator
    {
        public static bool IsValidCountry(string country)
        {
            return Enum.TryParse(typeof(Country), country.Replace(" ", ""), ignoreCase: true, out _);
        }
    }
}

