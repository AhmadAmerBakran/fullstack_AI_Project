using Azure.AI.TextAnalytics;
using Microsoft.CognitiveServices.Speech;

namespace Service;

public class TextToSpeechService
{
    private readonly string _subscriptionKey;
    private readonly string _serviceRegion;
    private readonly SpeechConfig _speechConfig;
    private readonly LanguageDetectionService _languageDetectionService;


    public TextToSpeechService(string subscriptionKey, string serviceRegion, LanguageDetectionService languageDetectionService)
    {
        _subscriptionKey = Environment.GetEnvironmentVariable("TextToSpeech:SubscriptionKey");
        _serviceRegion = "northeurope";
        _speechConfig = SpeechConfig.FromSubscription(_subscriptionKey, _serviceRegion);
        _languageDetectionService = languageDetectionService;
    }
    
    public async Task<byte[]> ConvertTextToSpeechAsync(string text)
    {
        string languageCode = await _languageDetectionService.DetectLanguageAsync(text);
        
        string voiceName = GetVoiceNameFromLanguageCode(languageCode);
        
        _speechConfig.SpeechSynthesisVoiceName = voiceName;
        
        using var synthesizer = new SpeechSynthesizer(_speechConfig, null);
        var result = await synthesizer.SpeakTextAsync(text);
        
        if (result.Reason == ResultReason.SynthesizingAudioCompleted)
        {
            return result.AudioData;
        }
        else
        {
            throw new InvalidOperationException($"Speech synthesis failed for text: {text}, Reason: {result.Reason}");
        }
    }
    
    private string GetVoiceNameFromLanguageCode(string languageCode)
    {
        var voiceMap = new Dictionary<string, string>
        {
            { "en", "en-US-JennyNeural" },
            { "ar", "ar-EG-HodaNeural" },
            { "da", "da-DK-ChristelNeural" },
            { "es", "es-ES-AlvaroNeural" }, // Spanish
            { "fr", "fr-FR-DeniseNeural" }, // French
            { "de", "de-DE-KatjaNeural" },  // German
            { "it", "it-IT-ElsaNeural" },    // Italian
            { "ja", "ja-JP-NanamiNeural" },  // Japanese
            { "pt", "pt-BR-FranciscaNeural" }, // Portuguese (Brazil)
            { "zh", "zh-CN-XiaoxiaoNeural" }, // Chinese (Simplified)
            { "hi", "hi-IN-SwaraNeural" }, 
            // Add more language code to voice mappings here
        };

        return voiceMap.TryGetValue(languageCode, out var voiceName) ? voiceName : "en-US-JennyNeural";
    }
    
}