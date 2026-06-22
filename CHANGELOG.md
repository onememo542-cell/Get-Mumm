# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024

### Added
- Complete E2E testing infrastructure with 244+ tests
- UI tests for all pages (HomePage, MenuPage, ChefsPage, BlogPage, ContactPage, SubscriptionsPage)
- API tests for all endpoints (Menu, Chefs, Blog, Contact, Subscriptions)
- Database tests (schema, isolation, seeding, error handling)
- GitHub Actions CI/CD automation
- Allure test reporting with historical trends
- Docker Compose test environment
- Page object framework with Playwright
- Database fixtures with transaction isolation
- API client with async HTTP methods
- Exception handling framework
- Test data factories

### Changed
- Reorganized project structure (cleanup root, moved test files to tests/)
- Updated docker-compose paths for new locations
- Enhanced pytest configuration

### Fixed
- Backend Azure App Service deployment
- Frontend Netlify deployment (build base path, Node version)

## Versioning

Release versions follow semantic versioning:
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

See [Releases](https://github.com/Mostafa-SAID7/Get-Mumm/releases) for details.
