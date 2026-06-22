namespace GetMumm.Application.Interfaces;

using GetMumm.Application.DTOs;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(CreateOrderRequest request, CancellationToken cancellationToken = default);
    Task<OrderDto?> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<OrderStatusDto?> GetOrderStatusAsync(Guid id, CancellationToken cancellationToken = default);
}
