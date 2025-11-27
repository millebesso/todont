namespace Todont.Api.Models;

public class TodontItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Description { get; set; } = string.Empty;
    public DateTime? AvoidUntil { get; set; }
    public bool IsChecked { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsActive()
    {
        if (IsChecked)
            return true;

        if (AvoidUntil == null)
            return false;

        return DateTime.UtcNow < AvoidUntil.Value;
    }

    public bool CanUncheck()
    {
        if (AvoidUntil == null)
            return true;

        return DateTime.UtcNow >= AvoidUntil.Value;
    }
}
