using backend.Config;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace backend.Services
{
    public class EmailService
    {
        private readonly EmailConfig _emailConfig;

        public EmailService(EmailConfig emailConfig)
        {
            _emailConfig = emailConfig;
        }

        public async Task SendInvitationEmailAsync(string vendorEmail, Guid token)
        {
            var apiKey = _emailConfig.SendGridApiKey;
            if (string.IsNullOrEmpty(apiKey))
            {
                // debugging
                Console.WriteLine("SendGrid API Key is not configured.");
                return;
            }
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("hussainsakib44@gmail.com", "Superchat");
            var to = new EmailAddress(vendorEmail);
            var subject = "You're Invited to Join Our Vendor Platform";

            var setupUrl = $"http://localhost:5378/setup-vendor/{token}";
            var plainTextContent = $"Please complete your registration by clicking this link: {setupUrl}";
            var htmlContent = $"<strong>Please complete your registration by clicking this link:</strong> <a href='{setupUrl}'>Complete Registration</a>";

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            if (!response.IsSuccessStatusCode)
            {
                // Log the error details from SendGrid's response
                Console.WriteLine($"Failed to send email. Status Code: {response.StatusCode}");
                var errorBody = await response.Body.ReadAsStringAsync();
                Console.WriteLine($"Error Body: {errorBody}");
            }
            else
            {
                Console.WriteLine("Email sent successfully!");
            }
        }
    }
}