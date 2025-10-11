namespace backend.Helpers
{
    public static class PasswordValidator
    {
        public static bool IsStrongPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password)) return false;

            var hasUpperCase = password.Any(char.IsUpper);
            var hasLowerCase = password.Any(char.IsLower);
            var hasDigit = password.Any(char.IsDigit);
            var hasSpecialChar = password.Any(ch => "!@#$%^&*(),.?\":{}|<>".Contains(ch));
            var isValidLength = password.Length >= 8;

            return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isValidLength;
        }
    }

}
