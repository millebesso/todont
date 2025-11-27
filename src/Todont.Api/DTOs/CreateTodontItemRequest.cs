namespace Todont.Api.DTOs;

public record CreateTodontItemRequest(string Description, DateTime? AvoidUntil);
