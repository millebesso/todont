namespace Todont.Api.Test;

using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using System.Text;

public class ApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Test");
        builder.ConfigureServices(services =>
        {
            services.Configure<HttpsRedirectionOptions>(options =>
            {
                options.HttpsPort = 5001;
            });
        });
    }
}

public class ApiTests: IClassFixture<ApiFactory>
{
    private readonly ApiFactory _apiFactory;

    public ApiTests(ApiFactory apiFactory) {
        _apiFactory = apiFactory;
    }

    [Fact]
    public async Task TestHealth()
    {
        var client = _apiFactory.CreateClient();
        var result = await client.GetAsync("/health");
        Assert.Equal(200, (int) result.StatusCode);
    }

    [Fact]
    public async Task TestCreateList()
    {
        string name = "foo";
        var client = _apiFactory.CreateClient();
        var json = JsonSerializer.Serialize(new { Name = name });
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
        var result = await client.PostAsync("/api/lists", httpContent);

        Assert.Equal(201, (int) result.StatusCode);
        var content = await result.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(content);
        var root = doc.RootElement;

        Assert.Equal(name, root.GetProperty("name").GetString());
    }
}
