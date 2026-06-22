using System.Net;

namespace GetMumm.Api.Middleware;

/// <summary>
/// Middleware component that implements IP-based rate limiting for contact endpoints.
/// Prevents abuse and DOS attacks by limiting the number of requests per IP address.
/// </summary>
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private readonly RateLimitStore _rateLimitStore;
    private readonly int _maxRequests;
    private readonly int _windowSeconds;

    // In-memory store for rate limit tracking (for MVP; use Redis for production)
    private static readonly Dictionary<string, RateLimitInfo> RateLimitCache = new();
    private static readonly object LockObject = new();

    public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger, IConfiguration configuration)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _rateLimitStore = new RateLimitStore();

        // Read rate limit configuration
        _maxRequests = configuration.GetValue<int>("RateLimit:MaxRequests", 5);
        _windowSeconds = configuration.GetValue<int>("RateLimit:WindowInSeconds", 3600);
    }

    /// <summary>
    /// Invokes the middleware to process the HTTP request.
    /// Checks rate limits for contact endpoints.
    /// </summary>
    /// <param name="context">The HTTP context for the current request.</param>
    public async Task InvokeAsync(HttpContext context)
    {
        // Only rate limit contact endpoints
        if (ShouldRateLimit(context.Request.Path))
        {
            var clientIp = GetClientIpAddress(context);
            
            if (IsRateLimitExceeded(clientIp))
            {
                _logger.LogWarning("Rate limit exceeded for IP {ClientIp}", clientIp);
                
                context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.Response.Headers.Add("Retry-After", _windowSeconds.ToString());
                context.Response.ContentType = "application/json";

                var errorResponse = new
                {
                    message = "Too many requests. Please try again later.",
                    retryAfter = _windowSeconds
                };

                var json = System.Text.Json.JsonSerializer.Serialize(errorResponse);
                await context.Response.WriteAsync(json);
                return;
            }

            // Track this request
            RecordRequest(clientIp);
        }

        await _next(context);
    }

    /// <summary>
    /// Determines whether the current request should be rate limited.
    /// </summary>
    /// <param name="path">The request path.</param>
    /// <returns>True if the path is a rate-limited endpoint.</returns>
    private static bool ShouldRateLimit(PathString path)
    {
        var pathValue = path.Value?.ToLowerInvariant() ?? string.Empty;
        
        // Rate limit contact endpoints
        return pathValue.StartsWith("/api/contact");
    }

    /// <summary>
    /// Extracts the client IP address from the HTTP context.
    /// Handles X-Forwarded-For header for requests behind proxies.
    /// </summary>
    /// <param name="context">The HTTP context.</param>
    /// <returns>The client IP address.</returns>
    private static string GetClientIpAddress(HttpContext context)
    {
        // Check for X-Forwarded-For header (proxy scenarios)
        if (context.Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
        {
            var forwarded = forwardedFor.ToString().Split(',').First().Trim();
            if (IPAddress.TryParse(forwarded, out _))
            {
                return forwarded;
            }
        }

        // Check for X-Real-IP header
        if (context.Request.Headers.TryGetValue("X-Real-IP", out var realIp))
        {
            if (IPAddress.TryParse(realIp.ToString(), out _))
            {
                return realIp.ToString();
            }
        }

        // Fall back to connection remote IP
        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    /// <summary>
    /// Checks if the rate limit has been exceeded for the given client IP.
    /// </summary>
    /// <param name="clientIp">The client IP address.</param>
    /// <returns>True if rate limit exceeded; false otherwise.</returns>
    private bool IsRateLimitExceeded(string clientIp)
    {
        lock (LockObject)
        {
            if (!RateLimitCache.TryGetValue(clientIp, out var limitInfo))
            {
                return false; // First request from this IP
            }

            // Check if the window has expired
            if (DateTime.UtcNow - limitInfo.WindowStart > TimeSpan.FromSeconds(_windowSeconds))
            {
                // Window expired, reset
                RateLimitCache.Remove(clientIp);
                return false;
            }

            return limitInfo.RequestCount >= _maxRequests;
        }
    }

    /// <summary>
    /// Records a request from the given client IP.
    /// </summary>
    /// <param name="clientIp">The client IP address.</param>
    private void RecordRequest(string clientIp)
    {
        lock (LockObject)
        {
            if (!RateLimitCache.TryGetValue(clientIp, out var limitInfo))
            {
                // First request in new window
                RateLimitCache[clientIp] = new RateLimitInfo
                {
                    WindowStart = DateTime.UtcNow,
                    RequestCount = 1
                };
            }
            else
            {
                // Check if window has expired
                if (DateTime.UtcNow - limitInfo.WindowStart > TimeSpan.FromSeconds(_windowSeconds))
                {
                    // Window expired, reset
                    RateLimitCache[clientIp] = new RateLimitInfo
                    {
                        WindowStart = DateTime.UtcNow,
                        RequestCount = 1
                    };
                }
                else
                {
                    // Increment request count within window
                    limitInfo.RequestCount++;
                }
            }
        }
    }

    /// <summary>
    /// Represents rate limit information for a single IP address.
    /// </summary>
    private class RateLimitInfo
    {
        public DateTime WindowStart { get; set; }
        public int RequestCount { get; set; }
    }
}

/// <summary>
/// Placeholder for rate limit store (can be extended to use Redis in future).
/// </summary>
public class RateLimitStore
{
    // Future: Can be extended to use Redis or other distributed cache
}
