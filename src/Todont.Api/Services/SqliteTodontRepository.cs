using Microsoft.Data.Sqlite;
using Dapper;
using Todont.Api.Models;

namespace Todont.Api.Services;

public class SqliteTodontRepository : ITodontRepository
{
    private readonly string _connectionString;

    public SqliteTodontRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("DefaultConnection string is required");
    }

    private SqliteConnection CreateConnection()
    {
        var connection = new SqliteConnection(_connectionString);
        connection.Open();
        return connection;
    }

    public TodontList CreateList(string name)
    {
        var list = new TodontList { Name = name };

        using var connection = CreateConnection();
        connection.Execute(
            "INSERT INTO Lists (Id, Name, CreatedAt) VALUES (@Id, @Name, @CreatedAt)",
            new { list.Id, list.Name, CreatedAt = list.CreatedAt.ToString("O") }
        );

        return list;
    }

    public TodontList? GetList(string id)
    {
        using var connection = CreateConnection();

        var listDto = connection.QueryFirstOrDefault<ListDto>(
            "SELECT Id, Name, CreatedAt FROM Lists WHERE Id = @Id",
            new { Id = id }
        );

        if (listDto == null)
            return null;

        var itemDtos = connection.Query<ItemDto>(
            "SELECT Id, ListId, Description, AvoidUntil, IsChecked, CreatedAt FROM Items WHERE ListId = @ListId",
            new { ListId = id }
        );

        var result = new TodontList
        {
            Id = listDto.Id,
            Name = listDto.Name,
            CreatedAt = DateTime.Parse(listDto.CreatedAt).ToUniversalTime(),
            Items = itemDtos.Select(i => new TodontItem
            {
                Id = i.Id,
                Description = i.Description,
                AvoidUntil = string.IsNullOrEmpty(i.AvoidUntil)
                    ? null
                    : DateTime.Parse(i.AvoidUntil).ToUniversalTime(),
                IsChecked = i.IsChecked,
                CreatedAt = DateTime.Parse(i.CreatedAt).ToUniversalTime()
            }).ToList()
        };

        return result;
    }

    public TodontItem AddItem(string listId, string description, DateTime? avoidUntil)
    {
        using var connection = CreateConnection();

        var listExists = connection.QueryFirstOrDefault<int>(
            "SELECT COUNT(*) FROM Lists WHERE Id = @Id",
            new { Id = listId }
        );

        if (listExists == 0)
            throw new KeyNotFoundException($"List with id {listId} not found");

        var item = new TodontItem
        {
            Description = description,
            AvoidUntil = avoidUntil
        };

        connection.Execute(
            @"INSERT INTO Items (Id, ListId, Description, AvoidUntil, IsChecked, CreatedAt)
              VALUES (@Id, @ListId, @Description, @AvoidUntil, @IsChecked, @CreatedAt)",
            new
            {
                item.Id,
                ListId = listId,
                item.Description,
                AvoidUntil = item.AvoidUntil?.ToString("O"),
                IsChecked = item.IsChecked ? 1 : 0,
                CreatedAt = item.CreatedAt.ToString("O")
            }
        );

        return item;
    }

    public bool UpdateItemStatus(string listId, string itemId, bool isChecked)
    {
        using var connection = CreateConnection();

        var rowsAffected = connection.Execute(
            "UPDATE Items SET IsChecked = @IsChecked WHERE Id = @ItemId AND ListId = @ListId",
            new { IsChecked = isChecked ? 1 : 0, ItemId = itemId, ListId = listId }
        );

        return rowsAffected > 0;
    }

    public bool UpdateItem(string listId, string itemId, string description, DateTime? avoidUntil)
    {
        using var connection = CreateConnection();

        var rowsAffected = connection.Execute(
            @"UPDATE Items SET Description = @Description, AvoidUntil = @AvoidUntil
              WHERE Id = @ItemId AND ListId = @ListId",
            new
            {
                Description = description,
                AvoidUntil = avoidUntil?.ToString("O"),
                ItemId = itemId,
                ListId = listId
            }
        );

        return rowsAffected > 0;
    }

    public bool DeleteItem(string listId, string itemId)
    {
        using var connection = CreateConnection();

        var rowsAffected = connection.Execute(
            "DELETE FROM Items WHERE Id = @ItemId AND ListId = @ListId",
            new { ItemId = itemId, ListId = listId }
        );

        return rowsAffected > 0;
    }

    private class ListDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }

    private class ItemDto
    {
        public string Id { get; set; } = string.Empty;
        public string ListId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? AvoidUntil { get; set; }
        public bool IsChecked { get; set; }
        public string CreatedAt { get; set; } = string.Empty;
    }
}
