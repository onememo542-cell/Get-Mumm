using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;

namespace GetMumm.Api.Controllers;

/// <summary>
/// API controller for chef-related operations.
/// Provides endpoints for retrieving chef information and details.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ChefsController : ControllerBase
{
    private readonly IChefsService _chefsService;
    private readonly ILogger<ChefsController> _logger;

    public ChefsController(IChefsService chefsService, ILogger<ChefsController> logger)
    {
        _chefsService = chefsService;
        _logger = logger;
    }

    /// <summary>
    /// Get all chefs.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of all chefs</returns>
    [HttpGet]
    public async Task<ActionResult<ListChefsResponse>> GetAllChefs(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get all chefs request received");
            var chefs = await _chefsService.GetAllChefsAsync(cancellationToken);
            return Ok(new ListChefsResponse { Data = chefs });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving chefs");
            throw;
        }
    }

    /// <summary>
    /// Get a single chef by ID.
    /// </summary>
    /// <param name="id">Chef ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Chef details</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetChefResponse>> GetChefById(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get chef by ID request received - ID: {ChefId}", id);
            var chef = await _chefsService.GetChefByIdAsync(id, cancellationToken);

            if (chef == null)
            {
                _logger.LogWarning("Chef not found - ID: {ChefId}", id);
                return NotFound();
            }

            return Ok(new GetChefResponse { Data = chef });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving chef - ID: {ChefId}", id);
            throw;
        }
    }
}
