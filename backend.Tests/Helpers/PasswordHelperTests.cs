using Xunit;
using FluentAssertions;
using backend.Helpers;

namespace backend.Tests.Helpers
{
    public class PasswordHelperTests
    {
        [Fact]
        public void Hash_ShouldReturnNonEmptyString()
        {
            // Arrange
            var password = "SuperSecure123!";

            // Act
            var hashed = PasswordHelper.Hash(password);

            // Assert
            hashed.Should().NotBeNullOrWhiteSpace();
            hashed.Should().Contain(";"); // Salt and hash are separated by delimiter
        }

        [Fact]
        public void Verify_ShouldReturnTrue_ForCorrectPassword()
        {
            // Arrange
            var password = "SuperSecure123!";
            var hashed = PasswordHelper.Hash(password);

            // Act
            var result = PasswordHelper.Verify(password, hashed);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void Verify_ShouldReturnFalse_ForIncorrectPassword()
        {
            // Arrange
            var original = "SuperSecure123!";
            var wrong = "WrongPassword!";
            var hashed = PasswordHelper.Hash(original);

            // Act
            var result = PasswordHelper.Verify(wrong, hashed);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void Verify_ShouldReturnFalse_ForMalformedHash()
        {
            // Arrange
            var password = "SuperSecure123!";
            var malformed = "notabase64salt:notabase64hash";

            // Act
            var result = PasswordHelper.Verify(password, malformed);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void Verify_ShouldReturnFalse_WhenDelimiterMissing()
        {
            // Arrange
            var password = "SuperSecure123!";
            var invalidFormat = "justonestringwithoutdelimiter";

            // Act
            var result = PasswordHelper.Verify(password, invalidFormat);

            // Assert
            result.Should().BeFalse();
        }
    }
}
