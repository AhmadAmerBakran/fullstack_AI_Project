using Infrastructure.Interfaces;
using Infrastructure.Models;
using Microsoft.Extensions.Logging;

namespace Service;

public class CommentService
{
    private readonly ILogger<CommentService> _logger;
    private readonly ICommentRepository _commentRepository;
    private readonly TranslationService _translationService;


    public CommentService(ILogger<CommentService> logger, ICommentRepository commentRepository, TranslationService translationService)
    {
        _logger = logger;
        _commentRepository = commentRepository;
        _translationService = translationService;
    }

    public async Task<Comment> CreateComment(Comment comment, string targetLanguage = "en")
    {
        try
        {
            comment.Content = await _translationService.TranslateTextAsync(comment.Content, targetLanguage);
            
            return _commentRepository.CreateComment(comment.PostId, comment.Content);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error creating comment: {Message}", ex.Message);
            throw;
        }
    }

    public IEnumerable<Comment> GetAllComments(int postId)
    {
        try
        {
            return _commentRepository.GetAllComments(postId);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error retrieving all comments: {Message}", ex.Message);
            throw;
        }
    }
    
    public Comment? GetCommentById(int id)
    {
        try
        {
            return _commentRepository.GetCommentById(id);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error retrieving post by ID: {Message}", ex.Message);
            throw;
        }
    }
    
}