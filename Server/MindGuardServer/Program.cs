using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MindGuardServer.Data;
using MindGuardServer.Mappings;
using MindGuardServer.Services;
using MindGuardServer.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MindGuard API", Version = "v1" });

    var jwt = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Enter your JWT access token",
        Reference = new OpenApiReference { Id = JwtBearerDefaults.AuthenticationScheme, Type = ReferenceType.SecurityScheme }
    };
    c.AddSecurityDefinition("Bearer", jwt);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { { jwt, Array.Empty<string>() } });

    c.EnableAnnotations();
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
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEntryService, EntryService>();
builder.Services.AddScoped<IRoutineService, RoutineService>();
builder.Services.AddScoped<ISummaryService, SummaryService>();
builder.Services.AddScoped<IMoodService, MoodService>();
builder.Services.AddScoped<IPredictionService, PredictionService>();
builder.Services.AddHostedService<WeeklySummaryScheduler>();
builder.Services.AddHttpClient<GeminiAnalyzerService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(600); 
});
builder.Services.AddScoped<IGeminiAnalyzerService>(provider => 
    provider.GetRequiredService<GeminiAnalyzerService>());


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var env = Environment.GetEnvironmentVariable("ENABLE_SEED");
    if (string.Equals(env, "true", StringComparison.OrdinalIgnoreCase))
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await BulkSeedJournalEntries.RunAsync(db);
        Console.WriteLine("SeedJournalEntries: completed.");
    }
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MindGuard API v1");
        c.RoutePrefix = "swagger"; 
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

