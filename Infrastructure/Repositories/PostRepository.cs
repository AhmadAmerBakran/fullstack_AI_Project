using Dapper;
using Infrastructure.Interfaces;
using Infrastructure.Models;
using Npgsql;

namespace Infrastructure.Repositories;

public class PostRepository : IPostRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public PostRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public AnonymousPost CreateAnonymousPost(string title, string content, string imgUrl)
    {
        var sql = $@"
INSERT INTO anonymous_post.posts (title, content, publish_date, post_image)
VALUES (@Title, @Content, @PublishDate, @PostImage)
RETURNING id as {nameof(AnonymousPost.Id)}, title as {nameof(AnonymousPost.Title)}, 
content as {nameof(AnonymousPost.Content)}, publish_date as {nameof(AnonymousPost.PublishDate)}, 
post_image as {nameof(AnonymousPost.PostImage)};";

        try
        {
            using var connection = _dataSource.OpenConnection();
            return connection.QueryFirst<AnonymousPost>(sql, new
            {
                Title = title,
                Content = content,
                PublishDate = DateTime.UtcNow,
                PostImage = imgUrl
            });
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the anonymous post.", ex);
        }
    }

    public IEnumerable<AnonymousPost> GetAllAnonymousPosts()
    {
        var sql = $@"
SELECT p.id as {nameof(AnonymousPost.Id)}, p.title as {nameof(AnonymousPost.Title)}, 
p.content as {nameof(AnonymousPost.Content)}, p.publish_date as {nameof(AnonymousPost.PublishDate)}, 
p.post_image as {nameof(AnonymousPost.PostImage)},
COUNT(c.id) as {nameof(AnonymousPost.CommentCount)}
FROM anonymous_post.posts p
LEFT JOIN anonymous_post.comments c ON p.id = c.post_id
GROUP BY p.id;";

        try
        {
            using var connection = _dataSource.OpenConnection();
            return connection.Query<AnonymousPost>(sql);
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving posts.", ex);
        }
    }



    public AnonymousPost? GetAnonymousPostById(int id)
    {
        var sql = $@"
SELECT id as {nameof(AnonymousPost.Id)}, title as {nameof(AnonymousPost.Title)}, 
content as {nameof(AnonymousPost.Content)}, publish_date as {nameof(AnonymousPost.PublishDate)}, 
post_image as {nameof(AnonymousPost.PostImage)}
FROM anonymous_post.posts
WHERE id = @Id;";

        try
        {
            using var connection = _dataSource.OpenConnection();
            return connection.QueryFirstOrDefault<AnonymousPost>(sql, new { Id = id });
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while fetching the post.", ex);
        }
    }
}