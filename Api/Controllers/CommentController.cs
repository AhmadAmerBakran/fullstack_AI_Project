using System.ComponentModel.DataAnnotations;
using Api.Dtos;
using Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly CommentService _service;
    private readonly TranslationService _translationService;
    private readonly TextToSpeechService _textToSpeechService;


    public CommentController(CommentService service, TranslationService translationService, TextToSpeechService textToSpeechService)
    {
        _service = service;
        _translationService = translationService;
        _textToSpeechService = textToSpeechService;

    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateComment([FromBody] Comment comment, [FromQuery] string targetLanguage = "en")
    {
        try
        {
            var createdComment = await _service.CreateComment(comment, targetLanguage);
            return Ok(new ResponseDto { MessageToClient = "Comment created successfully", ResponseData = createdComment });
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
    [Route("/api/post/{postId}/comments")]
    public IActionResult GetAllComments(int postId)
    {
        try
        {
            var comments = _service.GetAllComments(postId);
            if (comments.Any())
            {
                return Ok(new ResponseDto { MessageToClient = "Successfully fetched", ResponseData = comments });
            }

            return NotFound(new ResponseDto { MessageToClient = "No comments available" });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ResponseDto { MessageToClient = ex.Message });
        }
    }
    
    [HttpPost("translate/{commentId}")]
    public async Task<IActionResult> TranslateComment(int commentId, [FromBody] TranslateRequest request)
    {
        var comment =  _service.GetCommentById(commentId);
        if (comment == null) 
        {
            return NotFound("Comment not found");
        }

        var translatedContent = await _translationService.TranslateTextAsync(comment.Content, request.TargetLanguage);
        return Ok(new { TranslatedText = translatedContent });
    }
    
    [HttpGet("tts/{commentId}")]
    public async Task<IActionResult> ReadCommentAloud(int commentId)
    {
        var comment = _service.GetCommentById(commentId);
        if (comment == null) 
        {
            return NotFound("Comment not found");
        }

        try
        {
            var audioBytes = await _textToSpeechService.ConvertTextToSpeechAsync(comment.Content);
            return File(audioBytes, "audio/wav");
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error converting comment text to speech");
        }
    }

}