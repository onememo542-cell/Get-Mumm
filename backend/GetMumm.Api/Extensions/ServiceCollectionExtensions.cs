namespace GetMumm.Api.Extensions;

using GetMumm.Application.Interfaces;
using GetMumm.Application.Services;
using FluentValidation;
using GetMumm.Application.Validators;
using AutoMapper;
using GetMumm.Application.Mappings;

/// <summary>
/// Extension methods for registering application layer services.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds application layer services to the DI container.
    /// </summary>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register validators
        services.AddValidatorsFromAssemblyContaining<SubmitContactRequestValidator>();
        
        // Register AutoMapper
        services.AddAutoMapper(typeof(MappingProfile));
        
        // Register application services
        services.AddScoped<IMenuService, MenuService>();
        services.AddScoped<IChefsService, ChefsService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IBlogService, BlogService>();
        services.AddScoped<ISubscriptionService, SubscriptionService>();
        services.AddScoped<ITestimonialService, TestimonialService>();
        services.AddScoped<IStatsService, StatsService>();
        
        return services;
    }
}
