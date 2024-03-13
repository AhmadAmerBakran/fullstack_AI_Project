using Infrastructure.Interfaces;
using Infrastructure.Models;
using Microsoft.Extensions.Logging;

namespace Service;

public class PostService
{
    private readonly ILogger<PostService> _logger;
    private readonly IPostRepository _postRepository;
    private readonly TranslationService _translationService;


    public PostService(ILogger<PostService> logger, IPostRepository postRepository, TranslationService translationService)
    {
        _logger = logger;
        _postRepository = postRepository;
        _translationService = translationService;

    }

    public async Task<AnonymousPost> CreateAnonymousPost(AnonymousPost post, string targetLanguage = "en")
    {
        try
        {
            post.Title = await _translationService.TranslateTextAsync(post.Title, targetLanguage);
            post.Content = await _translationService.TranslateTextAsync(post.Content, targetLanguage);
            
            return _postRepository.CreateAnonymousPost(post.Title, post.Content, post.PostImage);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error creating post: {Message}", ex.Message);
            throw;
        }
    }

    public IEnumerable<AnonymousPost> GetAllAnonymousPosts()
    {
        try
        {
            return _postRepository.GetAllAnonymousPosts();
        }
        catch (Exception ex)
        {
            _logger.LogError("Error retrieving all anonymous posts: {Message}", ex.Message);
            throw;
        }
    }

    public AnonymousPost? GetAnonymousPostById(int id)
    {
        try
        {
            return _postRepository.GetAnonymousPostById(id);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error retrieving post by ID: {Message}", ex.Message);
            throw;
        }
    }
}