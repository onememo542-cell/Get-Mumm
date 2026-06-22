namespace GetMumm.Domain.Enums;

/// <summary>
/// Represents dietary restrictions and food preferences
/// </summary>
public enum DietaryRestriction
{
    /// <summary>
    /// Vegetarian - no meat but includes dairy and eggs
    /// </summary>
    Vegetarian = 0,

    /// <summary>
    /// Vegan - no animal products at all
    /// </summary>
    Vegan = 1,

    /// <summary>
    /// Gluten free - no gluten-containing ingredients
    /// </summary>
    GlutenFree = 2,

    /// <summary>
    /// Nut free - no peanuts or tree nuts
    /// </summary>
    NutFree = 3
}
