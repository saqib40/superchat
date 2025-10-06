using System.Security.Cryptography;

class Program
{
    public static void HashAndDisplay(string password)
    {
        Console.WriteLine("Using Bcrypt library");
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
    private const int SaltSize = 16; // salt to add, thereby identical passwords will have different hashes
    private const int KeySize = 32; // hash size
    private const int Iterations = 10000;
    private const char Delimiter = ';';
    private static readonly HashAlgorithmName _hashAlgorithm = HashAlgorithmName.SHA256;

    public static string HashInbuilt(string password)
    {
        Console.WriteLine(password);
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, _hashAlgorithm, KeySize);
        return string.Join(Delimiter, Convert.ToBase64String(salt), Convert.ToBase64String(hash));
    }
    public static bool HashVerify(string password, string hashedPassword)
    {
        var parts = hashedPassword.Split(Delimiter);
        if (parts.Length != 2)
        {
            return false;
        }

        var salt = Convert.FromBase64String(parts[0]);
        var hash = Convert.FromBase64String(parts[1]);

        var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, _hashAlgorithm, KeySize);

        return hashToCompare.SequenceEqual(hash);
    }
    static void Main(string[] args)
    {
        Console.WriteLine("--- Inbuilt Password Hashing ---");

        // Call the function with a sample password
        string hasheg = HashInbuilt("hlo123");
        Console.WriteLine(hasheg);
        hasheg = HashInbuilt("hii12345");
        Console.WriteLine(hasheg);
        hasheg = HashInbuilt("12345");
        Console.WriteLine(hasheg);
        hasheg = HashInbuilt("1234");
        Console.WriteLine(hasheg);
    }
}
