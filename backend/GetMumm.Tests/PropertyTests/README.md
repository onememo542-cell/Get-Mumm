# Property-Based Tests

Property-based tests use random data generation (CsCheck) to verify that properties hold for all valid inputs, catching edge cases that hand-written tests might miss.

## Structure

```
PropertyTests/
├── Validation/           # Property tests for validators
├── Filtering/            # Property tests for filters and queries
├── Transformation/       # Property tests for mappings and conversions
└── [FeatureFolder]/      # Organize by feature/domain
```

## Guidelines

- **Properties, Not Examples**: Test universal properties, not specific data
- **Use Generators**: Use `PropertyTestGenerators` for realistic data
- **Many Iterations**: CsCheck runs 100+ iterations per test by default
- **Shrinking**: CsCheck automatically finds minimal failing examples
- **Document Intent**: Clearly state what property should hold

## Example

```csharp
public class MenuFilterPropertyTests
{
    /// <summary>
    /// Validates: Requirements 1.5
    /// Property: Page numbers must be positive integers
    /// </summary>
    [Fact]
    public void PageNumber_MustBePositive()
    {
        var pageGen = PropertyTestGenerators.ValidPageNumberGen();
        
        Gen.Sample(pageGen).ForAll(page =>
        {
            page.Should().BeGreaterThan(0);
        });
    }

    /// <summary>
    /// Validates: Requirements 1.5
    /// Property: PageSize enforcement ≤ 100
    /// </summary>
    [Fact]
    public void PageSize_MustNotExceed100()
    {
        var filterGen = PropertyTestGenerators.MenuItemFilterDtoGen();
        
        Gen.Sample(filterGen).ForAll(filter =>
        {
            filter.PageSize.Should().BeLessThanOrEqualTo(100);
        });
    }

    /// <summary>
    /// Validates: Requirements 1.5
    /// Property: Invalid page sizes (> 100) are rejected by validator
    /// </summary>
    [Fact]
    public void InvalidPageSize_RaisesValidationError()
    {
        var filterGen = PropertyTestGenerators.InvalidPageSizeFilterGen();
        var validator = new MenuItemFilterDtoValidator();
        
        Gen.Sample(filterGen).ForAll(filter =>
        {
            var result = validator.Validate(filter);
            result.IsValid.Should().BeFalse();
        });
    }
}
```

## Using PropertyTestGenerators

Available generators:
- `MenuItemFilterDtoGen()` - Valid filters with constrained pagination
- `ValidPageNumberGen()` - Positive page numbers
- `InvalidPageSizeGen()` - Page sizes > 100 for negative testing
- `ValidEmailGen()` - RFC 5322 compliant emails
- `InvalidEmailGen()` - Non-email strings
- `ValidContactRequestGen()` - Complete contact forms
- `VeryLongStringGen()` - Strings exceeding length limits

Example with custom constraint:
```csharp
var positiveIntsGen = Gen.Int[1, int.MaxValue];
```

## Common Properties to Test

1. **Bounds Checking**: Values within expected ranges
2. **Format Validation**: Emails, phone numbers, URLs follow patterns
3. **Length Constraints**: String lengths within limits
4. **Immutability**: Mappings don't modify source objects
5. **Consistency**: Related values maintain invariants
6. **Idempotence**: Multiple calls produce same result

## Test Categories

- **Validation Properties**: Input constraints enforced
- **Transformation Properties**: Mappings preserve data integrity
- **Filtering Properties**: Query results match criteria
- **Boundary Properties**: Edge cases handled correctly

## Shrinking & Reporting

When CsCheck finds a failure, it automatically shrinks the input to the simplest case. The test output shows:
- Minimal failing example
- Number of iterations before failure
- Seed for reproduction

Example failure output:
```
Counterexample found after 45 iterations:
PageSize = 105
Property failed: PageSize.Should().BeLessThanOrEqualTo(100)
Seed: 12345
```

To reproduce: Create a test with explicit seed or use exact failing value.

## Requirement Coverage

Each property test should reference which requirements it validates:

```csharp
/// <summary>
/// Validates: Requirements 1.5, 30, 31
/// Property: Pagination bounds enforced for all MenuItemFilterDto inputs
/// </summary>
[Fact]
public void PaginationBounds_EnforcedForAllInputs()
{
    // Test implementation
}
```
