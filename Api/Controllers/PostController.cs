using System.ComponentModel.DataAnnotations;
using Api.Dtos;
using Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly PostService _service;
    private readonly TranslationService _translationService;
    private readonly TextToSpeechService _textToSpeechService;


    public PostController(PostService service, TranslationService translationService, TextToSpeechService textToSpeechService)
    {
        _service = service;
        _translationService = translationService;
        _textToSpeechService = textToSpeechService;

    }
    
    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateAnonymousPost([FromBody] AnonymousPost post, [FromQuery] string targetLanguage = "en")
    {
        try
        {
            var createdPost = await _service.CreateAnonymousPost(post, targetLanguage);
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
    
    [HttpPost("translate/{postId}")]
    public async Task<IActionResult> TranslatePost(int postId, [FromBody] TranslateRequest request)
    {
        var post =  _service.GetAnonymousPostById(postId);
        if (post == null) return NotFound("Post not found");

        var translatedContent = await _translationService.TranslateTextAsync(post.Content, request.TargetLanguage);

        return Ok(new { TranslatedText = translatedContent });
    }
    
    [HttpGet("tts/{postId}")]
    public async Task<IActionResult> ReadPostAloud(int postId)
    {
        var post =  _service.GetAnonymousPostById(postId);
        if (post == null) return NotFound("Post not found");

        try
        {
            var audioBytes = await _textToSpeechService.ConvertTextToSpeechAsync(post.Content);
            return File(audioBytes, "audio/wav");
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error converting text to speech");
        }
    }

}

