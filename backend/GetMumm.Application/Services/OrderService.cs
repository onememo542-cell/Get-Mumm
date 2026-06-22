namespace GetMumm.Application.Services;

using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Enums;
using GetMumm.Domain.Interfaces;
using Microsoft.Extensions.Logging;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IRepository<MenuItem> _menuItemRepository;
    private readonly ILogger<OrderService> _logger;

    private const decimal DeliveryFee = 25m;
    private const decimal FreeDeliveryThreshold = 150m;

    public OrderService(
        IOrderRepository orderRepository,
        IRepository<MenuItem> menuItemRepository,
        ILogger<OrderService> logger)
    {
        _orderRepository    = orderRepository;
        _menuItemRepository = menuItemRepository;
        _logger             = logger;
    }

    public async Task<OrderDto> CreateOrderAsync(CreateOrderRequest request, CancellationToken cancellationToken = default)
    {
        if (request.Items == null || request.Items.Count == 0)
            throw new ArgumentException("Order must contain at least one item.");

        var allMenuItems = await _menuItemRepository.GetAllAsync(cancellationToken);
        var menuItemMap  = allMenuItems.ToDictionary(m => m.Id); // Guid → MenuItem

        var orderItems = new List<OrderItem>();
        decimal subtotal = 0;

        foreach (var req in request.Items)
        {
            if (!menuItemMap.TryGetValue(req.MenuItemId, out var menuItem))
                throw new ArgumentException($"Menu item {req.MenuItemId} not found.");

            if (!menuItem.IsAvailable)
                throw new InvalidOperationException($"Menu item '{menuItem.Name}' is currently unavailable.");

            if (req.Qty <= 0)
                throw new ArgumentException($"Quantity for item {req.MenuItemId} must be at least 1.");

            subtotal += menuItem.Price * req.Qty;

            orderItems.Add(new OrderItem
            {
                MenuItemId = menuItem.Id, // Guid
                Name       = menuItem.Name,
                NameAr     = menuItem.NameAr,
                ImageUrl   = menuItem.ImageUrl,
                Price      = menuItem.Price,
                Qty        = req.Qty,
            });
        }

        var fee   = subtotal >= FreeDeliveryThreshold ? 0m : DeliveryFee;
        var total = subtotal + fee;

        var paymentMethod = request.PaymentMethod?.ToLowerInvariant() == "card"
            ? PaymentMethod.Card
            : PaymentMethod.CashOnDelivery;

        var order = new Order
        {
            Status              = OrderStatus.Confirmed,
            CustomerName        = request.CustomerName.Trim(),
            Phone               = request.Phone.Trim(),
            Area                = request.Area.Trim(),
            Street              = request.Street.Trim(),
            Building            = request.Building.Trim(),
            Notes               = request.Notes?.Trim() ?? string.Empty,
            PaymentMethod       = paymentMethod,
            Subtotal            = subtotal,
            DeliveryFee         = fee,
            Total               = total,
            PlacedAt            = DateTime.UtcNow,
            EstimatedDeliveryAt = DateTime.UtcNow.AddMinutes(55),
            Items               = orderItems,
        };

        var created = await _orderRepository.CreateAsync(order, cancellationToken);
        _logger.LogInformation("Order {OrderId} created for {CustomerName}", created.Id, created.CustomerName);
        return MapToDto(created);
    }

    public async Task<OrderDto?> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await _orderRepository.GetByIdWithItemsAsync(id, cancellationToken);
        return order is null ? null : MapToDto(order);
    }

    public async Task<OrderStatusDto?> GetOrderStatusAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await _orderRepository.GetStatusByIdAsync(id, cancellationToken);
        if (order is null) return null;
        return new OrderStatusDto
        {
            Id                  = order.Id,
            Status              = order.Status.ToString(),
            EstimatedDeliveryAt = order.EstimatedDeliveryAt,
        };
    }

    private static OrderDto MapToDto(Order order) => new()
    {
        Id                  = order.Id,
        Status              = order.Status.ToString(),
        CustomerName        = order.CustomerName,
        Phone               = order.Phone,
        Area                = order.Area,
        Street              = order.Street,
        Building            = order.Building,
        Notes               = order.Notes,
        PaymentMethod       = order.PaymentMethod == PaymentMethod.Card ? "card" : "cod",
        Subtotal            = order.Subtotal,
        DeliveryFee         = order.DeliveryFee,
        Total               = order.Total,
        PlacedAt            = order.PlacedAt,
        EstimatedDeliveryAt = order.EstimatedDeliveryAt,
        StripeClientSecret  = order.StripeClientSecret,
        Items               = order.Items?.Select(i => new OrderItemDto
        {
            Id         = i.Id,
            MenuItemId = i.MenuItemId,
            Name       = i.Name,
            NameAr     = i.NameAr,
            ImageUrl   = i.ImageUrl,
            Price      = i.Price,
            Qty        = i.Qty,
        }).ToList() ?? new(),
    };
}
