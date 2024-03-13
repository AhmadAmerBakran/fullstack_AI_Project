using Azure;
using Azure.AI.TextAnalytics;

namespace Service;

public class LanguageDetectionService
{
    private readonly TextAnalyticsClient _textAnalyticsClient;

    public LanguageDetectionService(string endpoint, string apiKey)
    {
        _textAnalyticsClient = new TextAnalyticsClient(new Uri(Environment.GetEnvironmentVariable("TextAnalyticsEndpoint")),
                                                 new AzureKeyCredential( Environment.GetEnvironmentVariable("TextAnalyticsApiKey")));
        
    }

    public async Task<string> DetectLanguageAsync(string text)
    {
        Response<DetectedLanguage> result = await _textAnalyticsClient.DetectLanguageAsync(text);
        return result.Value.Iso6391Name;
    }
}