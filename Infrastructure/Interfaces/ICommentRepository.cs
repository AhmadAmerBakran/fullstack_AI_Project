using Infrastructure.Models;

namespace Infrastructure.Interfaces;

public interface ICommentRepository
{
    Comment CreateComment(int postId, string content);
    IEnumerable<Comment> GetAllComments(int postId);
    Comment? GetCommentById(int id);
}