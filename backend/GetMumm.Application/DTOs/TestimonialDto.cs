namespace GetMumm.Application.DTOs;

/// <summary>
/// Data transfer object for customer testimonial
/// </summary>
public class TestimonialDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public string QuoteAr { get; set; } = string.Empty;
    public string Type { get; set; } = "customer";
    public decimal Rating { get; set; }
    public string AvatarUrl { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? CompanyAr { get; set; }
    public string? Role { get; set; }
    public string? RoleAr { get; set; }
}
