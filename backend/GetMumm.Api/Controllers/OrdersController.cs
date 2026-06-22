namespace GetMumm.Api.Controllers;

using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    /// <summary>
    /// Place a new order. Prices are validated server-side against the live menu.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(
        [FromBody] CreateOrderRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Create order request from {CustomerName}", request.CustomerName);
            var order = await _orderService.CreateOrderAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid order request");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Order rejected: {Message}", ex.Message);
            return UnprocessableEntity(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get full order details by ID (used on confirmation and tracking pages).
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OrderDto>> GetOrder(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var order = await _orderService.GetOrderByIdAsync(id, cancellationToken);
        if (order is null) return NotFound(new { message = "Order not found." });
        return Ok(order);
    }

    /// <summary>
    /// Lightweight status poll for the tracking page (status + ETA only).
    /// </summary>
    [HttpGet("{id:guid}/status")]
    public async Task<ActionResult<OrderStatusDto>> GetOrderStatus(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var status = await _orderService.GetOrderStatusAsync(id, cancellationToken);
        if (status is null) return NotFound(new { message = "Order not found." });
        return Ok(status);
    }

    /// <summary>
    /// Create a Stripe PaymentIntent for card orders.
    /// Returns 501 until STRIPE_SECRET_KEY is configured.
    /// </summary>
    [HttpPost("{id:guid}/payment-intent")]
    public IActionResult CreatePaymentIntent(Guid id)
    {
        var stripeKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");
        if (string.IsNullOrWhiteSpace(stripeKey))
        {
            return StatusCode(501, new
            {
                message = "Stripe is not yet configured. Set STRIPE_SECRET_KEY to enable card payments.",
                orderId = id,
            });
        }

        return StatusCode(501, new { message = "Stripe integration pending." });
    }
}
