using Infrastructure.Interfaces;
using Infrastructure.Models;
using Microsoft.Extensions.Logging;

namespace Service;

public class PostService
{
    private readonly ILogger<PostService> _logger;
    private readonly IPostRepository _postRepository;

    public PostService(ILogger<PostService> logger, IPostRepository postRepository)
    {
        _logger = logger;
        _postRepository = postRepository;
    }

    public AnonymousPost CreateAnonymousPost(AnonymousPost post)
    {
        try
        {
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