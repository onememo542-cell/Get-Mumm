namespace GetMumm.Domain.Entities;

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }

    public Guid MenuItemId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string NameAr { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Qty { get; set; }

    public Order Order { get; set; } = null!;
}
