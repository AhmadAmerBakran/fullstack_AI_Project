using System.ComponentModel.DataAnnotations;
using Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly PostService _service;

    public PostController(PostService service)
    {
        _service = service;
    }
    
    [HttpPost]
    [Route("create")]
    public IActionResult CreateAnonymousPost([FromBody] AnonymousPost post)
    {
        try
        {
            var createdPost = _service.CreateAnonymousPost(post);
            return Ok(new ResponseDto { MessageToClient = "Post created successfully", ResponseData = createdPost });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new ResponseDto { MessageToClient = ex.ValidationResult.ErrorMessage });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ResponseDto { MessageToClient = ex.Message });
        }
    }

    [HttpGet]
    [Route("posts")]
    public IActionResult GetAllPosts()
    {
        try
        {
            var posts = _service.GetAllAnonymousPosts();
            if (posts.Any())
            {
                return Ok(new ResponseDto { MessageToClient = "Successfully fetched", ResponseData = posts });
            }

            return NotFound(new ResponseDto { MessageToClient = "No posts available" });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ResponseDto { MessageToClient = ex.Message });
        }
    }

    [HttpGet]
    [Route("posts/{id}")]
    public IActionResult GetPostById(int id)
    {
        try
        {
            var post = _service.GetAnonymousPostById(id);
            if (post != null)
            {
                return Ok(new ResponseDto { MessageToClient = "Post fetched successfully", ResponseData = post });
            }

            return NotFound(new ResponseDto { MessageToClient = "Post not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ResponseDto { MessageToClient = ex.Message });
        }
    }
}