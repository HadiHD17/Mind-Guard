using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MindGuardServer.Data;
using MindGuardServer.Mappings;
using MindGuardServer.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Enter your Jwt Access Token",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    options.AddSecurityDefinition("Bearer", jwtSecurityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {jwtSecurityScheme, Array.Empty<string>() }
    });
});
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
        ValidAudience = builder.Configuration["JwtConfig:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:Key"]!)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});
builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<EntryService>();
builder.Services.AddScoped<RoutineService>();
builder.Services.AddScoped<SummaryService>();
builder.Services.AddScoped<MoodService>();
builder.Services.AddScoped<PredictionService>();
builder.Services.AddScoped<OutcomeService>();
builder.Services.AddHttpClient<GeminiAnalyzerService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(600); // Increased timeout to 10 minutes
});


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var env = Environment.GetEnvironmentVariable("ENABLE_SEED");
    if (string.Equals(env, "true", StringComparison.OrdinalIgnoreCase))
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await SeedJournalEntries.RunAsync(db);
        Console.WriteLine("SeedJournalEntries: completed.");
    }
}

_ = Task.Run(async () =>
{
    try
    {
        using var client = new HttpClient();
        var baseUrl = builder.Configuration["AI:Ollama:BaseUrl"] ?? "http://localhost:11434";
        var model = builder.Configuration["AI:Ollama:Model"] ?? "qwen2.5:7b-instruct";
        var payload = new
        {
            model,
            stream = false,
            format = "json",
            keep_alive = "30m",
            options = new { num_predict = 8, num_ctx = 256, temperature = 0.0 },
            messages = new[] { new { role = "user", content = "ok" } }
        };
        await client.PostAsJsonAsync($"{baseUrl}/api/chat", payload);
    }
    catch { /* ignore warmup errors */ }
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
