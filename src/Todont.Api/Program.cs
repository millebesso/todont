using Todont.Api.DTOs;
using Todont.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddSingleton<ITodontRepository, InMemoryTodontRepository>();
builder.Services.AddOpenApi();

// Add CORS for future frontend integration
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseHttpsRedirection();

// API Endpoints

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
}))
.WithName("HealthCheck")
.WithOpenApi();

// Create a new todont list
app.MapPost("/api/lists", (CreateTodontListRequest request, ITodontRepository repository) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
    {
        return Results.BadRequest(new { error = "Name is required" });
    }

    var list = repository.CreateList(request.Name);
    return Results.Created($"/api/lists/{list.Id}", new
    {
        id = list.Id,
        name = list.Name,
        url = $"/l/{list.Id}",
        createdAt = list.CreatedAt
    });
})
.WithName("CreateList")
.WithOpenApi();

// Get a todont list by ID
app.MapGet("/api/lists/{id}", (string id, ITodontRepository repository) =>
{
    var list = repository.GetList(id);
    if (list == null)
    {
        return Results.NotFound(new { error = "List not found" });
    }

    return Results.Ok(new
    {
        id = list.Id,
        name = list.Name,
        items = list.Items.Select(item => new
        {
            id = item.Id,
            description = item.Description,
            avoidUntil = item.AvoidUntil,
            isChecked = item.IsChecked,
            isActive = item.IsActive(),
            canUncheck = item.CanUncheck(),
            createdAt = item.CreatedAt
        }),
        createdAt = list.CreatedAt
    });
})
.WithName("GetList")
.WithOpenApi();

// Add an item to a list
app.MapPost("/api/lists/{listId}/items", (string listId, CreateTodontItemRequest request, ITodontRepository repository) =>
{
    if (string.IsNullOrWhiteSpace(request.Description))
    {
        return Results.BadRequest(new { error = "Description is required" });
    }

    try
    {
        var item = repository.AddItem(listId, request.Description, request.AvoidUntil);
        return Results.Created($"/api/lists/{listId}/items/{item.Id}", new
        {
            id = item.Id,
            description = item.Description,
            avoidUntil = item.AvoidUntil,
            isChecked = item.IsChecked,
            isActive = item.IsActive(),
            canUncheck = item.CanUncheck(),
            createdAt = item.CreatedAt
        });
    }
    catch (KeyNotFoundException)
    {
        return Results.NotFound(new { error = "List not found" });
    }
})
.WithName("AddItem")
.WithOpenApi();

// Update an item's checked status
app.MapPatch("/api/lists/{listId}/items/{itemId}", (string listId, string itemId, UpdateTodontItemRequest request, ITodontRepository repository) =>
{
    // Get the list and item for validation
    var list = repository.GetList(listId);
    if (list == null)
    {
        return Results.NotFound(new { error = "List not found" });
    }

    var item = list.Items.FirstOrDefault(i => i.Id == itemId);
    if (item == null)
    {
        return Results.NotFound(new { error = "Item not found" });
    }

    // Validate: if trying to uncheck, ensure the avoid-until date has passed
    if (!request.IsChecked && !item.CanUncheck())
    {
        return Results.BadRequest(new { error = "Cannot uncheck item before avoid-until date has passed" });
    }

    var success = repository.UpdateItemStatus(listId, itemId, request.IsChecked);
    if (!success)
    {
        return Results.NotFound(new { error = "List or item not found" });
    }

    return Results.NoContent();
})
.WithName("UpdateItemStatus")
.WithOpenApi();

app.Run();

// Make Program class accessible for integration tests
public partial class Program { }
