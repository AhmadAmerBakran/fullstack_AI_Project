using Infrastructure.Models;

namespace Infrastructure.Interfaces;

public interface IPostRepository
{
    AnonymousPost CreateAnonymousPost(string title, string content, string imgUrl);
    IEnumerable<AnonymousPost> GetAllAnonymousPosts();
    AnonymousPost? GetAnonymousPostById(int id);
}