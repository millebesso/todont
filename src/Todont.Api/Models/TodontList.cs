namespace Todont.Api.Models;

public class TodontList
{
    public string Id { get; set; } = GenerateShortId();
    public string Name { get; set; } = string.Empty;
    public List<TodontItem> Items { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    private static string GenerateShortId()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        return new string(Enumerable.Range(0, 5)
            .Select(_ => chars[random.Next(chars.Length)])
            .ToArray());
    }
}
