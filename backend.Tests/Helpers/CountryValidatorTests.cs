using Xunit;
using FluentAssertions;
using backend.Helpers;

namespace backend.Tests.Helpers
{
    public class CountryValidatorTests
    {
        [Theory]
        [InlineData("India", true)]
        [InlineData("United States", true)]   // becomes "UnitedStates"
        [InlineData("Canada", true)]
        [InlineData("germany", true)]         // case-insensitive match
        [InlineData("Brazil", false)]         // not in enum
        [InlineData("", false)]               // empty string
        [InlineData("  ", false)]             // whitespace only
        [InlineData(null, false)]             // null input
        public void IsValidCountry_ShouldReturnExpectedResult(string input, bool expected)
        {
            // Act
            var result = CountryValidator.IsValidCountry(input);

            // Assert
            result.Should().Be(expected);
        }
    }
}
