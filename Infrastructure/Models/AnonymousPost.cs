namespace Infrastructure.Models;

public class AnonymousPost
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime PublishDate { get; set; }
    public string PostImage { get; set; }
    public int CommentCount { get; set; }
}