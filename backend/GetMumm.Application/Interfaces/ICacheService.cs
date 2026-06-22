namespace GetMumm.Application.Interfaces;

/// <summary>
/// Interface for caching service operations.
/// Provides abstraction for in-memory caching with expiration support.
/// </summary>
public interface ICacheService
{
    /// <summary>
    /// Gets a value from the cache, or computes and caches it if not found.
    /// </summary>
    /// <typeparam name="T">Type of the cached value</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="factory">Factory function to create the value if not cached</param>
    /// <param name="expiration">Optional cache expiration timespan</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Cached or newly computed value</returns>
    Task<T?> GetOrSetAsync<T>(
        string key,
        Func<CancellationToken, Task<T>> factory,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a value from the cache.
    /// </summary>
    /// <typeparam name="T">Type of the cached value</typeparam>
    /// <param name="key">Cache key</param>
    /// <returns>Cached value, or null if not found</returns>
    T? Get<T>(string key);

    /// <summary>
    /// Sets a value in the cache.
    /// </summary>
    /// <typeparam name="T">Type of the value</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="value">Value to cache</param>
    /// <param name="expiration">Optional cache expiration timespan</param>
    void Set<T>(string key, T value, TimeSpan? expiration = null);

    /// <summary>
    /// Removes a value from the cache.
    /// </summary>
    /// <param name="key">Cache key</param>
    void Remove(string key);
}
