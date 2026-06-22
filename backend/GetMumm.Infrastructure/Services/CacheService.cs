using GetMumm.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace GetMumm.Infrastructure.Services;

/// <summary>
/// Implementation of caching service using in-memory cache.
/// Provides fast caching for frequently accessed data like categories and featured items.
/// </summary>
public class CacheService : ICacheService
{
    private readonly IMemoryCache _memoryCache;

    /// <summary>
    /// Initializes a new instance of the CacheService class.
    /// </summary>
    /// <param name="memoryCache">Memory cache instance</param>
    public CacheService(IMemoryCache memoryCache)
    {
        _memoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
    }

    /// <summary>
    /// Gets a value from cache or computes and caches it using the provided factory.
    /// </summary>
    public async Task<T?> GetOrSetAsync<T>(
        string key,
        Func<CancellationToken, Task<T>> factory,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default)
    {
        if (_memoryCache.TryGetValue(key, out T? cachedValue))
        {
            return cachedValue;
        }

        var value = await factory(cancellationToken);

        if (value != null)
        {
            var cacheOptions = new MemoryCacheEntryOptions();
            if (expiration.HasValue)
            {
                cacheOptions.AbsoluteExpirationRelativeToNow = expiration;
            }
            else
            {
                cacheOptions.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
            }

            _memoryCache.Set(key, value, cacheOptions);
        }

        return value;
    }

    /// <summary>
    /// Gets a value directly from cache.
    /// </summary>
    public T? Get<T>(string key)
    {
        _memoryCache.TryGetValue(key, out T? value);
        return value;
    }

    /// <summary>
    /// Sets a value in the cache.
    /// </summary>
    public void Set<T>(string key, T value, TimeSpan? expiration = null)
    {
        var cacheOptions = new MemoryCacheEntryOptions();
        if (expiration.HasValue)
        {
            cacheOptions.AbsoluteExpirationRelativeToNow = expiration;
        }
        else
        {
            cacheOptions.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
        }

        _memoryCache.Set(key, value, cacheOptions);
    }

    /// <summary>
    /// Removes a value from the cache.
    /// </summary>
    public void Remove(string key)
    {
        _memoryCache.Remove(key);
    }
}
