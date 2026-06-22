using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;

namespace GetMumm.Api.Controllers;

/// <summary>
/// API controller for system statistics.
/// Provides endpoints for retrieving aggregated system statistics.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly IStatsService _statsService;
    private readonly ILogger<StatsController> _logger;

    public StatsController(IStatsService statsService, ILogger<StatsController> logger)
    {
        _statsService = statsService;
        _logger = logger;
    }

    /// <summary>
    /// Get system statistics.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>System statistics including counts</returns>
    [HttpGet]
    public async Task<ActionResult<StatsDto>> GetStats(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get stats request received");
            var stats = await _statsService.GetStatsAsync(cancellationToken);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving statistics");
            throw;
        }
    }
}
