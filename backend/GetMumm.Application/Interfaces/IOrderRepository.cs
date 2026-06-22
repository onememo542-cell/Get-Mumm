namespace GetMumm.Application.Interfaces;

using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<Order?> GetByIdWithItemsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Order?> GetStatusByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
