using Infrastructure.Interfaces;
using Infrastructure.Models;
using Microsoft.Extensions.Logging;

namespace Service;

public class CommentService
{
    private readonly ILogger<CommentService> _logger;
    private readonly ICommentRepository _commentRepository;

    public CommentService(ILogger<CommentService> logger, ICommentRepository commentRepository)
    {
        _logger = logger;
        _commentRepository = commentRepository;
    }

    public Comment CreateComment(Comment comment)
    {
        try
        {
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
}