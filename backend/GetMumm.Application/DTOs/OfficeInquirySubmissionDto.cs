namespace GetMumm.Application.DTOs;

public class OfficeInquirySubmissionDto
{
    public Guid Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public int HeadCount { get; set; }
    public string? DeliveryArea { get; set; }
    public string? Frequency { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
