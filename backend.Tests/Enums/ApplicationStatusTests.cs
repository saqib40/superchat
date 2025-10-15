using Xunit;
using FluentAssertions;
using backend.Enums;

namespace backend.Tests.Enums
{
    public class ApplicationStatusTests
    {
        [Fact]
        public void Enum_ShouldContainExpectedValues()
        {
            // Act
            var values = Enum.GetNames(typeof(ApplicationStatus));

            // Assert
            values.Should().Contain(new[]
            {
                "Submitted",
                "UnderReview",
                "ScheduledForInterview",
                "OfferExtended",
                "Hired",
                "Rejected"
            });
        }

        [Theory]
        [InlineData("Submitted", true)]
        [InlineData("UnderReview", true)]
        [InlineData("ScheduledForInterview", true)]
        [InlineData("OfferExtended", true)]
        [InlineData("Hired", true)]
        [InlineData("Rejected", true)]
        [InlineData("InvalidStatus", false)]
        [InlineData("", false)]
        [InlineData(null, false)]
        public void TryParse_ShouldReturnExpectedResult(string input, bool expected)
        {
            // Act
            var result = Enum.TryParse<ApplicationStatus>(input, ignoreCase: true, out _);

            // Assert
            result.Should().Be(expected);
        }

        [Fact]
        public void Enum_ShouldHaveSixValues()
        {
            // Act
            var count = Enum.GetValues(typeof(ApplicationStatus)).Length;

            // Assert
            count.Should().Be(6);
        }
    }
}
