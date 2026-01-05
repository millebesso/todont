using Microsoft.Data.Sqlite;
using Dapper;

namespace Todont.Api.Services;

public class DatabaseInitializer
{
    private readonly string _connectionString;

    public DatabaseInitializer(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("DefaultConnection string is required");
    }

    public void Initialize()
    {
        var connectionStringBuilder = new SqliteConnectionStringBuilder(_connectionString);
        var dbPath = connectionStringBuilder.DataSource;
        var directory = Path.GetDirectoryName(dbPath);

        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        using var connection = new SqliteConnection(_connectionString);
        connection.Open();

        connection.Execute(@"
            CREATE TABLE IF NOT EXISTS Lists (
                Id TEXT PRIMARY KEY,
                Name TEXT NOT NULL,
                CreatedAt TEXT NOT NULL
            )
        ");

        connection.Execute(@"
            CREATE TABLE IF NOT EXISTS Items (
                Id TEXT PRIMARY KEY,
                ListId TEXT NOT NULL,
                Description TEXT NOT NULL,
                AvoidUntil TEXT,
                IsChecked INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                FOREIGN KEY (ListId) REFERENCES Lists(Id) ON DELETE CASCADE
            )
        ");

        connection.Execute(@"
            CREATE INDEX IF NOT EXISTS IX_Items_ListId ON Items(ListId)
        ");
    }
}
