namespace GetMumm.Infrastructure.Data.Contexts;

using GetMumm.Domain.Entities;

/// <summary>
/// Entity Framework Core DbContext for Get Mumm application.
/// Manages database operations and entity relationships using Fluent API configuration.
/// Implements soft delete pattern through query filters.
/// </summary>
public class GetMummDbContext : DbContext
{
    /// <summary>
    /// Initializes a new instance of the GetMummDbContext.
    /// </summary>
    /// <param name="options">The DbContext configuration options</param>
    public GetMummDbContext(DbContextOptions<GetMummDbContext> options) : base(options)
    {
    }

    // DbSet properties for all entities
    
    /// <summary>
    /// Menu items collection
    /// </summary>
    public DbSet<MenuItem> MenuItems { get; set; } = null!;

    /// <summary>
    /// Menu categories collection
    /// </summary>
    public DbSet<Category> Categories { get; set; } = null!;

    /// <summary>
    /// Chefs collection
    /// </summary>
    public DbSet<Chef> Chefs { get; set; } = null!;

    /// <summary>
    /// Blog posts collection
    /// </summary>
    public DbSet<BlogPost> BlogPosts { get; set; } = null!;

    /// <summary>
    /// Contact submissions collection
    /// </summary>
    public DbSet<Contact> Contacts { get; set; } = null!;

    /// <summary>
    /// Office inquiry submissions collection
    /// </summary>
    public DbSet<OfficeInquiry> OfficeInquiries { get; set; } = null!;

    /// <summary>
    /// Subscriptions collection
    /// </summary>
    public DbSet<Subscription> Subscriptions { get; set; } = null!;

    /// <summary>
    /// Testimonials collection
    /// </summary>
    public DbSet<Testimonial> Testimonials { get; set; } = null!;

    /// <summary>
    /// Configures the schema needed for Entity Framework Core with Fluent API.
    /// Sets up entity relationships, cascade delete behavior, query filters for soft deletes,
    /// and database indexes for performance optimization.
    /// </summary>
    /// <param name="modelBuilder">The model builder to configure the EF Core model</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure PostgreSQL conventions
        modelBuilder.HasDefaultSchema("public");

        // Configure MenuItem → Category relationship
        modelBuilder.Entity<MenuItem>()
            .HasOne(m => m.Category)
            .WithMany(c => c.MenuItems)
            .HasForeignKey(m => m.CategoryId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("fk_menu_items_category_id");

        // Configure MenuItem → Chef relationship
        modelBuilder.Entity<MenuItem>()
            .HasOne(m => m.Chef)
            .WithMany(c => c.MenuItems)
            .HasForeignKey(m => m.ChefId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("fk_menu_items_chef_id");

        // Configure Category → MenuItem navigation
        modelBuilder.Entity<Category>()
            .HasMany(c => c.MenuItems)
            .WithOne(m => m.Category)
            .HasForeignKey(m => m.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Chef → MenuItem navigation
        modelBuilder.Entity<Chef>()
            .HasMany(c => c.MenuItems)
            .WithOne(m => m.Chef)
            .HasForeignKey(m => m.ChefId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure soft delete query filters for all entity types
        // Automatically exclude soft-deleted entities from queries
        ConfigureSoftDeleteFilter<MenuItem>(modelBuilder);
        ConfigureSoftDeleteFilter<Category>(modelBuilder);
        ConfigureSoftDeleteFilter<Chef>(modelBuilder);
        ConfigureSoftDeleteFilter<BlogPost>(modelBuilder);
        ConfigureSoftDeleteFilter<Contact>(modelBuilder);
        ConfigureSoftDeleteFilter<OfficeInquiry>(modelBuilder);
        ConfigureSoftDeleteFilter<Subscription>(modelBuilder);
        ConfigureSoftDeleteFilter<Testimonial>(modelBuilder);

        // Configure database indexes for frequently filtered columns
        ConfigureIndexes(modelBuilder);
    }

    /// <summary>
    /// Configures a query filter for soft-deleted entities.
    /// Automatically excludes entities where IsDeleted = true from queries.
    /// </summary>
    /// <typeparam name="TEntity">The entity type to configure</typeparam>
    /// <param name="modelBuilder">The model builder instance</param>
    private static void ConfigureSoftDeleteFilter<TEntity>(ModelBuilder modelBuilder)
        where TEntity : BaseEntity
    {
        modelBuilder.Entity<TEntity>()
            .HasQueryFilter(e => !e.IsDeleted);
    }

    /// <summary>
    /// Configures database indexes on frequently filtered columns for query optimization.
    /// </summary>
    /// <param name="modelBuilder">The model builder instance</param>
    private static void ConfigureIndexes(ModelBuilder modelBuilder)
    {
        // Index on MenuItem.CategoryId for fast category filtering
        modelBuilder.Entity<MenuItem>()
            .HasIndex(m => m.CategoryId)
            .HasDatabaseName("idx_menu_items_category_id");

        // Index on MenuItem.IsFeatured for featured items queries
        modelBuilder.Entity<MenuItem>()
            .HasIndex(m => m.IsFeatured)
            .HasDatabaseName("idx_menu_items_is_featured");

        // Index on MenuItem.IsAvailable for availability filtering
        modelBuilder.Entity<MenuItem>()
            .HasIndex(m => m.IsAvailable)
            .HasDatabaseName("idx_menu_items_is_available");

        // Composite index on MenuItem for common filter combinations
        modelBuilder.Entity<MenuItem>()
            .HasIndex(m => new { m.IsAvailable, m.IsFeatured })
            .HasDatabaseName("idx_menu_items_available_featured");

        // Index on Contact.CreatedAt for sorting and filtering by date
        modelBuilder.Entity<Contact>()
            .HasIndex(c => c.CreatedAt)
            .HasDatabaseName("idx_contacts_created_at");

        // Index on BlogPost.PublishStatus for publish status filtering
        modelBuilder.Entity<BlogPost>()
            .HasIndex(b => b.PublishStatus)
            .HasDatabaseName("idx_blog_posts_publish_status");

        // Index on BlogPost.Slug for slug-based lookups
        modelBuilder.Entity<BlogPost>()
            .HasIndex(b => b.Slug)
            .IsUnique()
            .HasDatabaseName("idx_blog_posts_slug_unique");

        // Index on Subscription.UserId for user lookups
        modelBuilder.Entity<Subscription>()
            .HasIndex(s => s.UserId)
            .HasDatabaseName("idx_subscriptions_user_id");

        // Index on Subscription.Status for status filtering
        modelBuilder.Entity<Subscription>()
            .HasIndex(s => s.Status)
            .HasDatabaseName("idx_subscriptions_status");
    }
}
