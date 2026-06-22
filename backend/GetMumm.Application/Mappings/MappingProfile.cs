namespace GetMumm.Application.Mappings;

using AutoMapper;
using GetMumm.Application.DTOs;
using GetMumm.Domain.Entities;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        ConfigureMenuItemMappings();
        ConfigureCategoryMappings();
        ConfigureChefMappings();
        ConfigureBlogPostMappings();
        ConfigureTestimonialMappings();
        ConfigureContactMappings();
        ConfigureOfficeInquiryMappings();
        ConfigureSubscriptionMappings();
    }

    private void ConfigureMenuItemMappings()
    {
        CreateMap<MenuItem, MenuItemDto>()
            .ForMember(dest => dest.CategoryName,   opt => opt.MapFrom(src => src.CategoryName))
            .ForMember(dest => dest.CategoryNameAr, opt => opt.MapFrom(src => src.CategoryNameAr))
            .ForMember(dest => dest.ChefName,       opt => opt.MapFrom(src => src.ChefName))
            .ForMember(dest => dest.ChefNameAr,     opt => opt.MapFrom(src => src.ChefNameAr))
            .ReverseMap();

        CreateMap<MenuItem, MenuItemDetailDto>()
            .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId))
            .ForMember(dest => dest.Chef,       opt => opt.MapFrom(src => src.Chef))
            .IncludeBase<MenuItem, MenuItemDto>()
            .ReverseMap();
    }

    private void ConfigureCategoryMappings()
    {
        CreateMap<Category, CategoryDto>().ReverseMap();
    }

    private void ConfigureChefMappings()
    {
        CreateMap<Chef, ChefDto>().ReverseMap();

        CreateMap<Chef, ChefDetailDto>()
            .ForMember(dest => dest.JoinedYear, opt => opt.MapFrom(src => src.JoinedYear))
            .IncludeBase<Chef, ChefDto>()
            .ReverseMap();
    }

    private static string MakeExcerpt(string text)
    {
        const int maxLen = 220;
        if (string.IsNullOrEmpty(text)) return string.Empty;
        text = text.Trim();
        return text.Length <= maxLen ? text : text.Substring(0, maxLen).TrimEnd() + "…";
    }

    private static string MakeExcerptAr(string text) => MakeExcerpt(text);

    private static int CalcReadTime(string text)
    {
        if (string.IsNullOrEmpty(text)) return 1;
        var words = text.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).Length;
        return Math.Max(1, (int)Math.Ceiling(words / 200.0));
    }

    private static readonly string[] DefaultBlogImages =
    {
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    };

    private static string DefaultBlogImage(Guid id) =>
        DefaultBlogImages[Math.Abs(id.GetHashCode()) % DefaultBlogImages.Length];

    private void ConfigureBlogPostMappings()
    {
        CreateMap<BlogPost, BlogPostDto>()
            .ForMember(dest => dest.Excerpt,         opt => opt.MapFrom(src => MakeExcerpt(src.Content)))
            .ForMember(dest => dest.ExcerptAr,       opt => opt.MapFrom(src => MakeExcerpt(src.ContentAr)))
            .ForMember(dest => dest.ImageUrl,        opt => opt.MapFrom(src => DefaultBlogImage(src.Id)))
            .ForMember(dest => dest.Type,            opt => opt.MapFrom(src => "blog"))
            .ForMember(dest => dest.Author,          opt => opt.MapFrom(src => src.AuthorName))
            .ForMember(dest => dest.AuthorAr,        opt => opt.MapFrom(src => src.AuthorNameAr))
            .ForMember(dest => dest.ReadTimeMinutes, opt => opt.MapFrom(src => CalcReadTime(src.Content)))
            .ForMember(dest => dest.Tags,            opt => opt.MapFrom(src => new List<string>()))
            .ReverseMap()
            .ForMember(dest => dest.AuthorName,   opt => opt.MapFrom(src => src.Author))
            .ForMember(dest => dest.AuthorNameAr, opt => opt.MapFrom(src => src.AuthorAr));

        CreateMap<BlogPost, BlogPostDetailDto>()
            .IncludeBase<BlogPost, BlogPostDto>()
            .ReverseMap();
    }

    private static readonly string[] DefaultAvatars =
    {
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    };

    private static string DefaultAvatar(Guid id) =>
        DefaultAvatars[Math.Abs(id.GetHashCode()) % DefaultAvatars.Length];

    private void ConfigureTestimonialMappings()
    {
        CreateMap<Testimonial, TestimonialDto>()
            .ForMember(dest => dest.Name,      opt => opt.MapFrom(src => src.CustomerName))
            .ForMember(dest => dest.NameAr,    opt => opt.MapFrom(src => src.CustomerName))
            .ForMember(dest => dest.Quote,     opt => opt.MapFrom(src => src.Content))
            .ForMember(dest => dest.QuoteAr,   opt => opt.MapFrom(src => src.Content))
            .ForMember(dest => dest.Type,      opt => opt.MapFrom(src => "customer"))
            .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(src => DefaultAvatar(src.Id)))
            .ForMember(dest => dest.Company,   opt => opt.Ignore())
            .ForMember(dest => dest.CompanyAr, opt => opt.Ignore())
            .ForMember(dest => dest.Role,      opt => opt.Ignore())
            .ForMember(dest => dest.RoleAr,    opt => opt.Ignore())
            .ReverseMap()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Content,      opt => opt.MapFrom(src => src.Quote));
    }

    private void ConfigureContactMappings()
    {
        CreateMap<SubmitContactRequest, Contact>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ReverseMap();
    }

    private void ConfigureOfficeInquiryMappings()
    {
        CreateMap<SubmitOfficeInquiryRequest, OfficeInquiry>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ReverseMap();
    }

    private void ConfigureSubscriptionMappings()
    {
        CreateMap<Subscription, SubscriptionDto>().ReverseMap();
    }
}
