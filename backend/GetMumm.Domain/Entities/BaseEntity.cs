namespace GetMumm.Domain.Entities;

/// <summary>
/// Base entity with common properties for all domain entities
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Primary key identifier (GUID for distributed systems and scalability)
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Soft delete flag - when true, entity is logically deleted
    /// </summary>
    public bool IsDeleted { get; set; } = false;

    /// <summary>
    /// Entity creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
