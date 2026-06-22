using GetMumm.Application.DTOs;

namespace GetMumm.Tests.Fixtures;

/// <summary>
/// Generators for property-based testing.
/// Simple test data generators for DTOs and entities.
/// </summary>
public static class PropertyTestGenerators
{
    /// <summary>
    /// Generate valid MenuItemFilterDto with constrained values.
    /// </summary>
    public static MenuItemFilterDto MenuItemFilterDtoGen() =>
        new()
        {
            Page = 1,
            PageSize = 10,
            CategoryId = null,
            Search = ""
        };

    /// <summary>
    /// Generate valid page numbers for pagination.
    /// </summary>
    public static int ValidPageNumberGen() => 1;

    /// <summary>
    /// Generate valid page sizes for pagination (1-100).
    /// </summary>
    public static int ValidPageSizeGen() => 10;

    /// <summary>
    /// Generate invalid page sizes (> 100).
    /// </summary>
    public static int InvalidPageSizeGen() => 101;

    /// <summary>
    /// Generate valid email addresses.
    /// </summary>
    public static string ValidEmailGen() => "test@example.com";

    /// <summary>
    /// Generate invalid email addresses.
    /// </summary>
    public static string InvalidEmailGen() => "not-an-email";

    /// <summary>
    /// Generate valid phone numbers.
    /// </summary>
    public static string ValidPhoneGen() => "+12125551234";

    /// <summary>
    /// Generate strings of specified length range.
    /// </summary>
    public static string StringOfLengthGen(int minLength, int maxLength) =>
        new string('a', minLength);

    /// <summary>
    /// Generate SubmitContactRequest with valid data.
    /// </summary>
    public static SubmitContactRequest ValidContactRequestGen() =>
        new()
        {
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "+12125551234",
            Message = "This is a test message with enough content",
            Subject = "Test Subject"
        };

    /// <summary>
    /// Generate MenuItemFilterDto with invalid page sizes.
    /// </summary>
    public static MenuItemFilterDto InvalidPageSizeFilterGen() =>
        new()
        {
            Page = 1,
            PageSize = 101,
            CategoryId = null,
            Search = ""
        };

    /// <summary>
    /// Generate MenuItemFilterDto with invalid page numbers.
    /// </summary>
    public static MenuItemFilterDto InvalidPageNumberFilterGen() =>
        new()
        {
            Page = 0,
            PageSize = 10,
            CategoryId = null,
            Search = ""
        };

    /// <summary>
    /// Generate negative decimal values (for boundary testing).
    /// </summary>
    public static decimal NegativeDecimalGen() => -1.5m;

    /// <summary>
    /// Generate very long string values (for length boundary testing).
    /// </summary>
    public static string VeryLongStringGen() =>
        new string('a', 1001);
}
