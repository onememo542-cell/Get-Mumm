using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;

namespace GetMumm.Api.Controllers;

/// <summary>
/// API controller for contact and inquiry operations.
/// Handles contact form submissions and office catering inquiries.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;
    private readonly ILogger<ContactController> _logger;

    public ContactController(IContactService contactService, ILogger<ContactController> logger)
    {
        _contactService = contactService;
        _logger = logger;
    }

    /// <summary>
    /// Submit a contact form message.
    /// </summary>
    /// <param name="request">Contact request data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success response</returns>
    [HttpPost]
    public async Task<ActionResult> SubmitContact([FromBody] SubmitContactRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Contact submission received from {Email}", request.Email);
            await _contactService.SubmitContactAsync(request, cancellationToken);
            return Ok(new { message = "Contact submission received successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing contact submission");
            throw;
        }
    }

    /// <summary>
    /// Submit an office catering inquiry.
    /// </summary>
    /// <param name="request">Office inquiry request data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success response</returns>
    [HttpPost("office-inquiry")]
    public async Task<ActionResult> SubmitOfficeInquiry([FromBody] SubmitOfficeInquiryRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Office inquiry received from {CompanyName}", request.CompanyName);
            await _contactService.SubmitOfficeInquiryAsync(request, cancellationToken);
            return Ok(new { message = "Office inquiry received successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing office inquiry");
            throw;
        }
    }
}
