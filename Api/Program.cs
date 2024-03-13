using Infrastructure;
using Infrastructure.Interfaces;
using Infrastructure.Repositories;
using Service;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;


// Add services to the container.
builder.Services.AddDistributedMemoryCache();
builder.Services.AddControllers();

builder.Services.AddHttpClient<TranslationService>();

builder.Services.AddNpgsqlDataSource(Utilities.ProperlyFormattedConnectionString,
    dataSourceBuilder => dataSourceBuilder.EnableParameterLogging());
builder.Services.AddSingleton<IPostRepository, PostRepository>();
builder.Services.AddSingleton<ICommentRepository, CommentRepository>();

builder.Services.AddSingleton<PostService>();
builder.Services.AddSingleton<CommentService>();
builder.Services.AddSingleton<TranslationService>();

builder.Services.AddSingleton<LanguageDetectionService>(serviceProvider =>
{
    string endpoint = Environment.GetEnvironmentVariable("TextAnalyticsEndpoint");
    string apiKey = Environment.GetEnvironmentVariable("TextAnalyticsApiKey");
    return new LanguageDetectionService(endpoint, apiKey);
});

builder.Services.AddSingleton<TextToSpeechService>(serviceProvider =>
{
    string subscriptionKey = Environment.GetEnvironmentVariable("TextToSpeech:SubscriptionKey");
    string serviceRegion = configuration["northeurope"];
    var languageDetectionService = serviceProvider.GetRequiredService<LanguageDetectionService>();
    return new TextToSpeechService(subscriptionKey, serviceRegion, languageDetectionService);
});


// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });

    options.AddPolicy("ProdCorsPolicy", builder =>
    {
        builder.WithOrigins("https://our-deployed-frontend-to-firebase") //not deployed yet
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self'; media-src 'none'; frame-src 'none'; font-src 'self'; connect-src 'self'");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("Feature-Policy", "accelerometer 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; payment 'none'; usb 'none'");
    context.Response.Headers.Add("Referrer-Policy", "no-referrer");
    await next();
});


app.UseRouting();

if (app.Environment.IsDevelopment())
{
    app.UseCors("DevCorsPolicy");
}
else
{
    app.UseCors("ProdCorsPolicy");
}

app.MapControllers();
app.Run();