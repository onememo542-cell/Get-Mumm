namespace GetMumm.Infrastructure.Data.Repositories;

using GetMumm.Domain.Interfaces;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.EntityFrameworkCore;

/// <summary>
/// Generic repository implementation for CRUD operations with async/await support
/// Handles all repository operations with full async/await and CancellationToken support
/// </summary>
/// <typeparam name="T">Entity type that inherits from BaseEntity</typeparam>
public class Repository<T> : IRepository<T> where T : class
{
    private readonly GetMummDbContext _context;
    private readonly DbSet<T> _dbSet;

    public Repository(GetMummDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _dbSet = context.Set<T>();
    }

    /// <summary>
    /// Get entity by ID
    /// </summary>
    /// <param name="id">Entity identifier</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Entity if found, null otherwise</returns>
    /// <exception cref="ArgumentException">Thrown when id is invalid (empty Guid)</exception>
    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        if (id == Guid.Empty)
            throw new ArgumentException("ID cannot be empty", nameof(id));

        return await _dbSet.FindAsync(new object[] { id }, cancellationToken: cancellationToken);
    }

    /// <summary>
    /// Get all entities
    /// </summary>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Complete collection of entities</returns>
    public async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Find entities matching predicate
    /// </summary>
    /// <param name="predicate">Lambda expression filter</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Filtered collection matching predicate</returns>
    /// <exception cref="ArgumentNullException">Thrown when predicate is null</exception>
    public async Task<IEnumerable<T>> FindAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        if (predicate == null)
            throw new ArgumentNullException(nameof(predicate), "Predicate cannot be null");

        return await _dbSet.Where(predicate).ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Create new entity
    /// </summary>
    /// <param name="entity">Entity to create</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Created entity with assigned ID</returns>
    /// <exception cref="ArgumentNullException">Thrown when entity is null</exception>
    public async Task<T> CreateAsync(T entity, CancellationToken cancellationToken = default)
    {
        if (entity == null)
            throw new ArgumentNullException(nameof(entity), "Entity cannot be null");

        await _dbSet.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    /// <summary>
    /// Update existing entity
    /// </summary>
    /// <param name="entity">Entity to update</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Updated entity</returns>
    /// <exception cref="ArgumentNullException">Thrown when entity is null</exception>
    public async Task<T> UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        if (entity == null)
            throw new ArgumentNullException(nameof(entity), "Entity cannot be null");

        _dbSet.Update(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    /// <summary>
    /// Delete entity by ID (soft delete - sets IsDeleted = true)
    /// </summary>
    /// <param name="id">Entity identifier</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>True if deletion successful, false if entity not found</returns>
    /// <exception cref="ArgumentException">Thrown when id is invalid (empty Guid)</exception>
    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        if (id == Guid.Empty)
            throw new ArgumentException("ID cannot be empty", nameof(id));

        var entity = await GetByIdAsync(id, cancellationToken);
        if (entity == null)
            return false;

        // Soft delete - set IsDeleted flag instead of removing row
        // This requires the entity to have IsDeleted property (from BaseEntity)
        var isDeletedProperty = entity.GetType().GetProperty("IsDeleted");
        if (isDeletedProperty != null && isDeletedProperty.CanWrite)
        {
            isDeletedProperty.SetValue(entity, true);
        }

        _dbSet.Update(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
