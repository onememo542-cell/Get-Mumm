using GetMumm.Application.Interfaces;
using GetMumm.Domain.Interfaces;
using GetMumm.Domain.Entities;
using AutoMapper;
using Moq;
using Microsoft.Extensions.Logging;

namespace GetMumm.Tests.Fixtures;

/// <summary>
/// Base fixture for unit tests with mocked dependencies.
/// Provides common setup and mocking utilities for controller and service tests.
/// </summary>
public class UnitTestFixture : IDisposable
{
    public Mock<IRepository<MenuItem>> MenuItemRepositoryMock { get; }
    public Mock<IRepository<Category>> CategoryRepositoryMock { get; }
    public Mock<IRepository<Chef>> ChefRepositoryMock { get; }
    public Mock<IRepository<Contact>> ContactRepositoryMock { get; }
    public Mock<IMapper> MapperMock { get; }

    public UnitTestFixture()
    {
        MenuItemRepositoryMock = new Mock<IRepository<MenuItem>>();
        CategoryRepositoryMock = new Mock<IRepository<Category>>();
        ChefRepositoryMock = new Mock<IRepository<Chef>>();
        ContactRepositoryMock = new Mock<IRepository<Contact>>();
        MapperMock = new Mock<IMapper>();
    }

    public Mock<ILogger<T>> GetLoggerMock<T>() => new Mock<ILogger<T>>();

    /// <summary>
    /// Resets all mocks to clean state for test isolation.
    /// </summary>
    public void Reset()
    {
        MenuItemRepositoryMock.Reset();
        CategoryRepositoryMock.Reset();
        ChefRepositoryMock.Reset();
        ContactRepositoryMock.Reset();
        MapperMock.Reset();
    }

    public void Dispose()
    {
        // Cleanup if needed
    }
}
