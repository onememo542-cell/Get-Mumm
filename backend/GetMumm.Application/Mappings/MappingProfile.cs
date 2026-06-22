namespace GetMumm.Application.Mappings;

using AutoMapper;
using GetMumm.Application.DTOs;
using GetMumm.Domain.Entities;

/// <summary>
/// AutoMapper profile for configuring entity-to-DTO mappings
/// Centralizes all mapping configurations in one place to maintain consistency
/// </summary>
public class MappingProfile : Profile
{
    /// <summary>
    /// Initializes the mapping profile with entity-to-DTO configurations
    /// </summary>
    public MappingProfile()
    {
        // MenuItem mappings
        ConfigureMenuItemMappings();

        // Category mappings
        ConfigureCategoryMappings();

        // Chef mappings
        ConfigureChefMappings();

        // BlogPost mappings
        ConfigureBlogPostMappings();

        // Testimonial mappings
        ConfigureTestimonialMappings();

        // Contact mappings
        ConfigureContactMappings();

        // OfficeInquiry mappings
        ConfigureOfficeInquiryMappings();

        // Subscription mappings
        ConfigureSubscriptionMappings();
    }

    /// <summary>
    /// Configures MenuItem to MenuItemDto and MenuItemDetailDto mappings
    /// </summary>
    private void ConfigureMenuItemMappings()
    {
        // MenuItem -> MenuItemDto (list view)
        CreateMap<MenuItem, MenuItemDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.CategoryName))
            .ForMember(dest => dest.CategoryNameAr, opt => opt.MapFrom(src => src.CategoryNameAr))
            .ForMember(dest => dest.ChefName, opt => opt.MapFrom(src => src.ChefName))
            .ForMember(dest => dest.ChefNameAr, opt => opt.MapFrom(src => src.ChefNameAr))
            .ReverseMap();

        // MenuItem -> MenuItemDetailDto (detail view)
        CreateMap<MenuItem, MenuItemDetailDto>()
            .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId))
            .ForMember(dest => dest.Chef, opt => opt.MapFrom(src => src.Chef))
            .IncludeBase<MenuItem, MenuItemDto>()
            .ReverseMap();
    }

    /// <summary>
    /// Configures Category to CategoryDto mappings
    /// </summary>
    private void ConfigureCategoryMappings()
    {
        // Category -> CategoryDto
        CreateMap<Category, CategoryDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.NameAr, opt => opt.MapFrom(src => src.NameAr))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.DescriptionAr, opt => opt.MapFrom(src => src.DescriptionAr))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
            .ForMember(dest => dest.ItemCount, opt => opt.MapFrom(src => src.ItemCount))
            .ReverseMap();
    }

    /// <summary>
    /// Configures Chef to ChefDto and ChefDetailDto mappings
    /// </summary>
    private void ConfigureChefMappings()
    {
        // Chef -> ChefDto (list view)
        CreateMap<Chef, ChefDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.NameAr, opt => opt.MapFrom(src => src.NameAr))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
            .ForMember(dest => dest.BioAr, opt => opt.MapFrom(src => src.BioAr))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
            .ForMember(dest => dest.Specialties, opt => opt.MapFrom(src => src.Specialties))
            .ForMember(dest => dest.SpecialtiesAr, opt => opt.MapFrom(src => src.SpecialtiesAr))
            .ForMember(dest => dest.ItemCount, opt => opt.MapFrom(src => src.ItemCount))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
            .ReverseMap();

        // Chef -> ChefDetailDto (detail view)
        CreateMap<Chef, ChefDetailDto>()
            .ForMember(dest => dest.JoinedYear, opt => opt.MapFrom(src => src.JoinedYear))
            .IncludeBase<Chef, ChefDto>()
            .ReverseMap();
    }

    /// <summary>
    /// Configures BlogPost to BlogPostDto and BlogPostDetailDto mappings
    /// </summary>
    private void ConfigureBlogPostMappings()
    {
        // BlogPost -> BlogPostDto
        CreateMap<BlogPost, BlogPostDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.TitleAr, opt => opt.MapFrom(src => src.TitleAr))
            .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
            .ForMember(dest => dest.ContentAr, opt => opt.MapFrom(src => src.ContentAr))
            .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.AuthorName))
            .ForMember(dest => dest.AuthorNameAr, opt => opt.MapFrom(src => src.AuthorNameAr))
            .ForMember(dest => dest.Slug, opt => opt.MapFrom(src => src.Slug))
            .ForMember(dest => dest.PublishStatus, opt => opt.MapFrom(src => src.PublishStatus))
            .ForMember(dest => dest.PublishedAt, opt => opt.MapFrom(src => src.PublishedAt))
            .ReverseMap();

        // BlogPost -> BlogPostDetailDto (inherits from BlogPostDto)
        CreateMap<BlogPost, BlogPostDetailDto>()
            .IncludeBase<BlogPost, BlogPostDto>()
            .ReverseMap();
    }

    /// <summary>
    /// Configures Testimonial to TestimonialDto mapping
    /// </summary>
    private void ConfigureTestimonialMappings()
    {
        // Testimonial -> TestimonialDto
        CreateMap<Testimonial, TestimonialDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.CustomerName))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
            .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
            .ReverseMap();
    }

    /// <summary>
    /// Configures SubmitContactRequest to Contact entity mapping
    /// </summary>
    private void ConfigureContactMappings()
    {
        // SubmitContactRequest -> Contact
        CreateMap<SubmitContactRequest, Contact>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone))
            .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Message))
            .ForMember(dest => dest.Subject, opt => opt.MapFrom(src => src.Subject))
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // Let database assign ID
            .ReverseMap();
    }

    /// <summary>
    /// Configures SubmitOfficeInquiryRequest to OfficeInquiry entity mapping
    /// </summary>
    private void ConfigureOfficeInquiryMappings()
    {
        // SubmitOfficeInquiryRequest -> OfficeInquiry
        CreateMap<SubmitOfficeInquiryRequest, OfficeInquiry>()
            .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.CompanyName))
            .ForMember(dest => dest.ContactName, opt => opt.MapFrom(src => src.ContactName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone))
            .ForMember(dest => dest.HeadCount, opt => opt.MapFrom(src => src.HeadCount))
            .ForMember(dest => dest.DeliveryArea, opt => opt.MapFrom(src => src.DeliveryArea))
            .ForMember(dest => dest.Frequency, opt => opt.MapFrom(src => src.Frequency))
            .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Message))
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // Let database assign ID
            .ReverseMap();
    }

    /// <summary>
    /// Configures Subscription entity to SubscriptionDto mapping
    /// </summary>
    private void ConfigureSubscriptionMappings()
    {
        // Subscription -> SubscriptionDto
        CreateMap<Subscription, SubscriptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.EndDate))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ReverseMap();
    }
}
