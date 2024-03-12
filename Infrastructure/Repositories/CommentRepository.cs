using Dapper;
using Infrastructure.Interfaces;
using Infrastructure.Models;
using Npgsql;

namespace Infrastructure.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public CommentRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public Comment CreateComment(int postId, string content)
    {
        var sql = $@"
INSERT INTO anonymous_post.comments (post_id, content, comment_date)
VALUES (@PostId, @Content, @CommentDate)
RETURNING id as {nameof(Comment.Id)}, 
post_id as {nameof(Comment.PostId)}, content as {nameof(Comment.Content)}, comment_date as {nameof(Comment.CommentDate)};";

        try
        {
            using var connection = _dataSource.OpenConnection();
            return connection.QueryFirst<Comment>(sql, new
            {
                PostId = postId,
                Content = content,
                CommentDate = DateTime.UtcNow
            });
        }
        
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the comment.", ex);
        }
    }

    public IEnumerable<Comment> GetAllComments(int postId)
    {
        var sql = $@"
SELECT id as {nameof(Comment.Id)}, 
post_id as {nameof(Comment.PostId)}, content as {nameof(Comment.Content)}, 
comment_date as {nameof(Comment.CommentDate)}
FROM anonymous_post.comments WHERE post_id = @PostId;";

        try
        {
            using var connection = _dataSource.OpenConnection();
            return connection.Query<Comment>(sql, new { PostId = postId });
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving comments.", ex);
        }
    }
}