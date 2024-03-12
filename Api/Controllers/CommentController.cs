using System.ComponentModel.DataAnnotations;
using Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly CommentService _service;

    public CommentController(CommentService service)
    {
        _service = service;
    }

    [HttpPost]
    [Route("create")]
    public IActionResult CreateComment([FromBody] Comment comment)
    {
        try
        {
            var createdComment = _service.CreateComment(comment);
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
}