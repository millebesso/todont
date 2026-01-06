namespace Todont.Api.DTOs;

public record UpdateTodontItemRequest(bool? IsChecked, string? Description, DateTime? AvoidUntil);
