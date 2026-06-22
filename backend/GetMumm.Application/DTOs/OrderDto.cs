namespace GetMumm.Application.DTOs;

public class OrderItemDto
{
    public Guid Id { get; set; }
    public Guid MenuItemId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Qty { get; set; }
    public decimal LineTotal => Price * Qty;
}

public class OrderDto
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string Building { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal Total { get; set; }
    public DateTime PlacedAt { get; set; }
    public DateTime EstimatedDeliveryAt { get; set; }
    public string? StripeClientSecret { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderStatusDto
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime EstimatedDeliveryAt { get; set; }
}

public class CreateOrderItemRequest
{
    public Guid MenuItemId { get; set; }
    public int Qty { get; set; }
}

public class CreateOrderRequest
{
    public string CustomerName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string Building { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "cod";
    public List<CreateOrderItemRequest> Items { get; set; } = new();
}
