namespace GetMumm.Domain.Interfaces;

/// <summary>
/// Generic repository interface for CRUD operations with async/await support
/// </summary>
/// <typeparam name="T">Entity type that inherits from BaseEntity</typeparam>
public interface IRepository<T> where T : class
{
    /// <summary>
    /// Get entity by ID
    /// </summary>
    /// <param name="id">Entity identifier</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Entity if found, null otherwise</returns>
    /// <exception cref="ArgumentException">Thrown when id is invalid (empty Guid)</exception>
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get all entities
    /// </summary>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Complete collection of entities</returns>
    Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Find entities matching predicate
    /// </summary>
    /// <param name="predicate">Lambda expression filter</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Filtered collection matching predicate</returns>
    /// <exception cref="ArgumentNullException">Thrown when predicate is null</exception>
    Task<IEnumerable<T>> FindAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Create new entity
    /// </summary>
    /// <param name="entity">Entity to create</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Created entity with assigned ID</returns>
    /// <exception cref="ArgumentNullException">Thrown when entity is null</exception>
    Task<T> CreateAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Update existing entity
    /// </summary>
    /// <param name="entity">Entity to update</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Updated entity</returns>
    /// <exception cref="ArgumentNullException">Thrown when entity is null</exception>
    Task<T> UpdateAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete entity by ID (soft delete - sets IsDeleted = true)
    /// </summary>
    /// <param name="id">Entity identifier</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>True if deletion successful, false if entity not found</returns>
    /// <exception cref="ArgumentException">Thrown when id is invalid (empty Guid)</exception>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
