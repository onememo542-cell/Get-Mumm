using GetMumm.Application.DTOs;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GetMumm.Api.Controllers;

/// <summary>
/// Health check endpoint for monitoring service availability
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly GetMummDbContext _dbContext;
    private readonly ILogger<HealthController> _logger;

    public HealthController(GetMummDbContext dbContext, ILogger<HealthController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Get service health status including database connectivity check
    /// </summary>
    /// <returns>Health check response with status "Healthy" or "Unhealthy"</returns>
    /// <response code="200">Service is healthy</response>
    /// <response code="503">Service is unhealthy</response>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<HealthCheckResponse>> GetHealth(CancellationToken cancellationToken = default)
    {
        var response = new HealthCheckResponse
        {
            Timestamp = DateTime.UtcNow
        };

        try
        {
            // Check database connectivity
            var canConnect = await _dbContext.Database.CanConnectAsync(cancellationToken);

            if (!canConnect)
            {
                _logger.LogWarning("Health check: Database connection failed");
                response.Status = "Unhealthy";
                response.DatabaseConnected = false;
                response.Message = "Database connection failed";
                return StatusCode(StatusCodes.Status503ServiceUnavailable, response);
            }

            response.Status = "Healthy";
            response.DatabaseConnected = true;
            response.Message = "Service is operational";

            _logger.LogInformation("Health check: Service is healthy");
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check: Unexpected error occurred");
            response.Status = "Unhealthy";
            response.DatabaseConnected = false;
            response.Message = $"Health check failed: {ex.Message}";
            return StatusCode(StatusCodes.Status503ServiceUnavailable, response);
        }
    }
}
