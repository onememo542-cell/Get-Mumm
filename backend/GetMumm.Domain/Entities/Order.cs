namespace GetMumm.Domain.Entities;

using GetMumm.Domain.Enums;

public class Order : BaseEntity
{
    public OrderStatus Status { get; set; } = OrderStatus.Confirmed;

    public string CustomerName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Area { get; set; } = string.Empty;

    public string Street { get; set; } = string.Empty;

    public string Building { get; set; } = string.Empty;

    public string Notes { get; set; } = string.Empty;

    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CashOnDelivery;

    public decimal Subtotal { get; set; }

    public decimal DeliveryFee { get; set; }

    public decimal Total { get; set; }

    public DateTime PlacedAt { get; set; } = DateTime.UtcNow;

    public DateTime EstimatedDeliveryAt { get; set; }

    public string? StripePaymentIntentId { get; set; }

    public string? StripeClientSecret { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
