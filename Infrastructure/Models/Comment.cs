namespace Infrastructure.Models;

public class Comment
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public string Content { get; set; }
    public DateTime CommentDate { get; set; }
}