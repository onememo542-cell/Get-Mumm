using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;

namespace GetMumm.Api.Controllers;

/// <summary>
/// API controller for subscription management.
/// Provides endpoints for CRUD operations on user subscriptions.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SubscriptionsController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;
    private readonly ILogger<SubscriptionsController> _logger;

    public SubscriptionsController(ISubscriptionService subscriptionService, ILogger<SubscriptionsController> logger)
    {
        _subscriptionService = subscriptionService;
        _logger = logger;
    }

    /// <summary>
    /// Get all subscriptions.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of all subscriptions</returns>
    [HttpGet]
    public async Task<ActionResult<List<SubscriptionDto>>> GetAllSubscriptions(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get all subscriptions request received");
            var subscriptions = await _subscriptionService.GetAllAsync(cancellationToken);
            return Ok(subscriptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving subscriptions");
            throw;
        }
    }

    /// <summary>
    /// Get a single subscription by ID.
    /// </summary>
    /// <param name="id">Subscription ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Subscription details</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SubscriptionDto>> GetSubscriptionById(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get subscription by ID request received - ID: {SubscriptionId}", id);
            var subscription = await _subscriptionService.GetByIdAsync(id, cancellationToken);

            if (subscription == null)
            {
                _logger.LogWarning("Subscription not found - ID: {SubscriptionId}", id);
                return NotFound();
            }

            return Ok(subscription);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving subscription - ID: {SubscriptionId}", id);
            throw;
        }
    }

    /// <summary>
    /// Create a new subscription.
    /// </summary>
    /// <param name="request">Subscription creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created subscription</returns>
    [HttpPost]
    public async Task<ActionResult<SubscriptionDto>> CreateSubscription([FromBody] CreateSubscriptionRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Create subscription request received for user {UserId}", request.UserId);
            var subscription = await _subscriptionService.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetSubscriptionById), new { id = subscription.Id }, subscription);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating subscription");
            throw;
        }
    }

    /// <summary>
    /// Update an existing subscription.
    /// </summary>
    /// <param name="id">Subscription ID</param>
    /// <param name="request">Subscription update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated subscription</returns>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SubscriptionDto>> UpdateSubscription(Guid id, [FromBody] UpdateSubscriptionRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Update subscription request received - ID: {SubscriptionId}", id);
            var subscription = await _subscriptionService.UpdateAsync(id, request, cancellationToken);

            if (subscription == null)
            {
                _logger.LogWarning("Subscription not found for update - ID: {SubscriptionId}", id);
                return NotFound();
            }

            return Ok(subscription);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating subscription - ID: {SubscriptionId}", id);
            throw;
        }
    }

    /// <summary>
    /// Cancel (delete) a subscription.
    /// </summary>
    /// <param name="id">Subscription ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success response</returns>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> CancelSubscription(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Cancel subscription request received - ID: {SubscriptionId}", id);
            var result = await _subscriptionService.CancelAsync(id, cancellationToken);

            if (!result)
            {
                _logger.LogWarning("Subscription not found for cancellation - ID: {SubscriptionId}", id);
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error canceling subscription - ID: {SubscriptionId}", id);
            throw;
        }
    }
}
