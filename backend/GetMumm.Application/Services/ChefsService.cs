using AutoMapper;
using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;

namespace GetMumm.Application.Services;

/// <summary>
/// Service for chef operations including retrieval and profile management.
/// Implements business logic for chef-related queries.
/// </summary>
public class ChefsService : IChefsService
{
    private readonly IRepository<Chef> _chefRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the ChefsService class.
    /// </summary>
    /// <param name="chefRepository">Repository for Chef entities</param>
    /// <param name="mapper">AutoMapper instance for entity-to-DTO conversion</param>
    public ChefsService(
        IRepository<Chef> chefRepository,
        IMapper mapper)
    {
        _chefRepository = chefRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Gets all chefs ordered by rating in descending order.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of chefs ordered by rating (highest first)</returns>
    public async Task<IEnumerable<ChefDto>> GetAllChefsAsync(CancellationToken cancellationToken = default)
    {
        var chefs = await _chefRepository.GetAllAsync(cancellationToken);
        var orderedChefs = chefs.OrderByDescending(c => c.Rating);
        return _mapper.Map<IEnumerable<ChefDto>>(orderedChefs);
    }

    /// <summary>
    /// Gets a single chef by ID with full details.
    /// Returns null if chef not found.
    /// </summary>
    /// <param name="id">Chef ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Chef detail, or null if not found</returns>
    public async Task<ChefDetailDto?> GetChefByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var chef = await _chefRepository.GetByIdAsync(id, cancellationToken);
        if (chef == null)
            return null;

        return _mapper.Map<ChefDetailDto>(chef);
    }
}
