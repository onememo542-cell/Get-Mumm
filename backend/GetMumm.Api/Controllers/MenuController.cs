using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GetMumm.Api.Controllers;

/// <summary>
/// API controller for menu-related operations.
/// Provides endpoints for retrieving categories, menu items, featured items, and item details.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly IMenuService _menuService;
    private readonly ILogger<MenuController> _logger;

    /// <summary>
    /// Initializes a new instance of the MenuController class.
    /// </summary>
    /// <param name="menuService">Menu service instance for business logic</param>
    /// <param name="logger">Logger instance</param>
    public MenuController(IMenuService menuService, ILogger<MenuController> logger)
    {
        _menuService = menuService;
        _logger = logger;
    }

    /// <summary>
    /// Get all menu categories.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of all menu categories</returns>
    /// <response code="200">Categories retrieved successfully</response>
    /// <response code="500">Internal server error occurred</response>
    [HttpGet("categories")]
    public async Task<ActionResult<ListCategoriesResponse>> GetCategories(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get categories request received");
            var categories = await _menuService.GetCategoriesAsync(cancellationToken);
            return Ok(new ListCategoriesResponse { Data = categories });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving categories");
            throw;
        }
    }

    /// <summary>
    /// Get featured menu items.
    /// Featured items are marked as featured and currently available.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of featured menu items</returns>
    /// <response code="200">Featured items retrieved successfully</response>
    /// <response code="500">Internal server error occurred</response>
    [HttpGet("items/featured")]
    public async Task<ActionResult<GetFeaturedItemsResponse>> GetFeaturedItems(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get featured items request received");
            var items = await _menuService.GetFeaturedItemsAsync(cancellationToken);
            return Ok(new GetFeaturedItemsResponse { Data = items });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving featured items");
            throw;
        }
    }

    /// <summary>
    /// Get menu items with optional filtering and pagination.
    /// Supports filtering by category ID and search term.
    /// </summary>
    /// <param name="filter">Filter parameters: CategoryId (optional), Search (optional), Page (default: 1), PageSize (default: 10, max: 100)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated list of menu items matching filter criteria</returns>
    /// <response code="200">Menu items retrieved successfully</response>
    /// <response code="400">Invalid filter parameters</response>
    /// <response code="500">Internal server error occurred</response>
    [HttpGet("items")]
    public async Task<ActionResult<ListMenuItemsResponse>> GetMenuItems(
        [FromQuery] MenuItemFilterDto filter,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation(
                "Get menu items request received with filter - CategoryId: {CategoryId}, Search: {Search}, Page: {Page}, PageSize: {PageSize}",
                filter.CategoryId, filter.Search, filter.Page, filter.PageSize);

            var items = await _menuService.GetMenuItemsAsync(filter, cancellationToken);
            return Ok(new ListMenuItemsResponse
            {
                Data = items.Data,
                Pagination = new PaginationMetadata
                {
                    Page = items.Page,
                    PageSize = items.PageSize,
                    Total = items.Total
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving menu items");
            throw;
        }
    }

    /// <summary>
    /// Get a single menu item by ID with full details.
    /// Includes chef information and complete item specification.
    /// </summary>
    /// <param name="id">Menu item ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Detailed menu item information</returns>
    /// <response code="200">Menu item retrieved successfully</response>
    /// <response code="404">Menu item not found</response>
    /// <response code="500">Internal server error occurred</response>
    [HttpGet("items/{id:guid}")]
    public async Task<ActionResult<GetMenuItemResponse>> GetMenuItemById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get menu item by ID request received - ID: {MenuItemId}", id);
            var item = await _menuService.GetMenuItemByIdAsync(id, cancellationToken);

            if (item == null)
            {
                _logger.LogWarning("Menu item not found - ID: {MenuItemId}", id);
                return NotFound();
            }

            return Ok(new GetMenuItemResponse { Data = item });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving menu item - ID: {MenuItemId}", id);
            throw;
        }
    }
}
