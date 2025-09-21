using System;

class Program
{
    public static void HashAndDisplay(string password)
    {
        // Check if the input string is null or empty
        if (string.IsNullOrEmpty(password))
        {
            Console.WriteLine("Password cannot be null or empty.");
            return;
        }

        Console.WriteLine($"Original String:  {password}");

        // Hash the password. BCrypt.Net handles salt generation automatically.
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        
        Console.WriteLine($"Hashed String: {hashedPassword}");
        Console.WriteLine("---");

        // For demonstration, let's also verify it right away
        bool isVerified = BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        Console.WriteLine($"Verification check: {(isVerified ? "Successful" : "Failed")}");
    }
    static void Main(string[] args)
    {
        Console.WriteLine("--- BCrypt Password Hashing ---");
        
        // Call the function with a sample password
        HashAndDisplay("hlo123");

        // Call it again with a different password
        HashAndDisplay("hii12345");

	HashAndDisplay("12345");

	HashAndDisplay("1234");
    }
}
