using AutoMapper;
using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;

namespace GetMumm.Application.Services;

/// <summary>
/// Service for menu operations including item retrieval, filtering, and category management.
/// Implements business logic for menu-related queries with pagination and filtering support.
/// </summary>
public class MenuService : IMenuService
{
    private readonly IRepository<MenuItem> _menuItemRepository;
    private readonly IRepository<Category> _categoryRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the MenuService class.
    /// </summary>
    /// <param name="menuItemRepository">Repository for MenuItem entities</param>
    /// <param name="categoryRepository">Repository for Category entities</param>
    /// <param name="mapper">AutoMapper instance for entity-to-DTO conversion</param>
    public MenuService(
        IRepository<MenuItem> menuItemRepository,
        IRepository<Category> categoryRepository,
        IMapper mapper)
    {
        _menuItemRepository = menuItemRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Gets all menu categories.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of all active categories</returns>
    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default)
    {
        var categories = await _categoryRepository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<CategoryDto>>(categories);
    }

    /// <summary>
    /// Gets menu items with filtering and pagination.
    /// Filters by category and search term, supports pagination with configurable page size (max 100).
    /// </summary>
    /// <param name="filter">Filter criteria including category ID, search term, page number, and page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated collection of menu items matching filter criteria</returns>
    public async Task<PaginatedResult<MenuItemDto>> GetMenuItemsAsync(
        MenuItemFilterDto filter,
        CancellationToken cancellationToken = default)
    {
        // Build the filter predicate
        var predicate = BuildMenuItemPredicate(filter);

        // Get all items matching the predicate
        var allItems = await _menuItemRepository.FindAsync(predicate, cancellationToken);
        var itemsList = allItems.ToList();

        // Apply pagination
        var paginatedItems = itemsList
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToList();

        // Map to DTOs
        var dtos = _mapper.Map<IEnumerable<MenuItemDto>>(paginatedItems);

        // Return paginated result
        return new PaginatedResult<MenuItemDto>
        {
            Data = dtos,
            Total = itemsList.Count,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    /// <summary>
    /// Gets featured menu items.
    /// Returns only items marked as featured and currently available for ordering.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of featured items</returns>
    public async Task<IEnumerable<MenuItemDto>> GetFeaturedItemsAsync(CancellationToken cancellationToken = default)
    {
        var items = await _menuItemRepository.FindAsync(
            x => x.IsFeatured && x.IsAvailable,
            cancellationToken);

        return _mapper.Map<IEnumerable<MenuItemDto>>(items);
    }

    /// <summary>
    /// Gets a single menu item by ID with full details.
    /// Returns null if item not found.
    /// </summary>
    /// <param name="id">Menu item ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Menu item detail, or null if not found</returns>
    public async Task<MenuItemDetailDto?> GetMenuItemByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await _menuItemRepository.GetByIdAsync(id, cancellationToken);
        if (item == null)
            return null;

        return _mapper.Map<MenuItemDetailDto>(item);
    }

    /// <summary>
    /// Builds a filter predicate for menu items based on filter criteria.
    /// Filters by availability, category ID, and search term (matching name or name_ar).
    /// </summary>
    /// <param name="filter">Filter criteria</param>
    /// <returns>Expression predicate for filtering menu items</returns>
    private static Expression<Func<MenuItem, bool>> BuildMenuItemPredicate(MenuItemFilterDto filter)
    {
        return item =>
            item.IsAvailable &&
            (filter.CategoryId == null || item.CategoryId == filter.CategoryId) &&
            (string.IsNullOrEmpty(filter.Search) ||
             item.Name.Contains(filter.Search) ||
             item.NameAr.Contains(filter.Search));
    }
}
