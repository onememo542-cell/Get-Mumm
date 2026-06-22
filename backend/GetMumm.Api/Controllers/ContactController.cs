using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;

namespace GetMumm.Api.Controllers;

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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactSubmissionDto>>> GetContacts(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get all contact submissions request received");
            var contacts = await _contactService.GetAllContactsAsync(cancellationToken);
            return Ok(contacts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving contact submissions");
            throw;
        }
    }

    [HttpGet("office-inquiries")]
    public async Task<ActionResult<IEnumerable<OfficeInquirySubmissionDto>>> GetOfficeInquiries(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get all office inquiry submissions request received");
            var inquiries = await _contactService.GetAllOfficeInquiriesAsync(cancellationToken);
            return Ok(inquiries);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving office inquiry submissions");
            throw;
        }
    }
}
