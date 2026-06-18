<div align="center">
  <img src="frontend/public/favicon.svg" width="120" height="120" alt="Get Mumm Logo" />
  <h1>Get Mumm</h1>
  <p>
    <strong>Homemade Meals Delivered with Love 🍲</strong>
  </p>
  <p>
    Experience the warmth of a grandmother's kitchen, delivered fresh to your door in Cairo and Giza. Support local women and enjoy authentic Egyptian flavors.
  </p>

  <a href="https://github.com/Mostafa-SAID7/Get-Mumm/issues"><img alt="Issues" src="https://img.shields.io/github/issues/Mostafa-SAID7/Get-Mumm?style=for-the-badge&color=C44E22" /></a>
  <a href="https://github.com/Mostafa-SAID7/Get-Mumm/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/Mostafa-SAID7/Get-Mumm?style=for-the-badge&color=FF3C00" /></a>
  <a href="https://github.com/Mostafa-SAID7/Get-Mumm/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/Mostafa-SAID7/Get-Mumm?style=for-the-badge&color=C44E22" /></a>
</div>

<hr />

## 🌟 Features

- 🥘 **Authentic Egyptian Cuisine:** Real homemade recipes cooked by certified local chefs.
- 📱 **Mobile-First App Experience:** A beautiful, intuitive interface for browsing and ordering.
- 🌐 **Bilingual Support:** Full English and Arabic (RTL) localization.
- 🏢 **Corporate Catering:** Dedicated plans for offices to elevate employee lunches.

## 🛠️ Technology Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- Framer Motion (Animations)
- React Query (Data Fetching)
- Wouter (Routing)

**Backend**
- Node.js + Express
- Drizzle ORM
- PostgreSQL
- Zod (Schema Validation)

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20
- PostgreSQL Database
- pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mostafa-SAID7/Get-Mumm.git
   cd Get-Mumm
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   pnpm install
   # Configure your .env file
   cp .env.example .env 
   pnpm dev
   ```

3. **Setup the Frontend**
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:8080`.

## 📂 Project Structure

This repository is split into two independent applications:

- `/frontend`: The React application and UI.
- `/backend`: The Express API and database schemas.

## 🧪 Testing

### E2E Testing Infrastructure

Complete end-to-end testing with Pytest + Playwright:

```bash
# Run all tests
./scripts/run-tests-local.bat    # Windows
./scripts/run-tests-local.sh     # Linux/Mac

# Run specific tests
pytest tests/ui -v               # UI tests only
pytest tests/api -v              # API tests only
pytest tests/database -v         # Database tests only

# Run with parallel workers
pytest tests/ -n 4
```

For comprehensive testing documentation, see [E2E Testing Guide](./docs/E2E_TESTING_README.md).

## 📁 Project Structure

```
get-mumm/
├── backend/                     # Express.js API
├── frontend/                    # React 19 UI
├── tests/                       # E2E tests (Pytest + Playwright)
├── scripts/                     # Utility scripts
│   ├── run-tests-local.bat/.sh  # Run tests
│   ├── wait-for-services.sh     # Health checks
│   └── pre-deploy.sh            # Pre-deployment
├── docs/                        # Documentation
├── .github/workflows/           # CI/CD workflows
├── docker-compose.yml           # Production setup
├── docker-compose.test.yml      # Testing setup
└── package.json                 # Root monorepo config
```

## 📚 Documentation

- [E2E Testing Guide](./docs/E2E_TESTING_README.md) - Complete testing documentation
- [E2E Implementation Summary](./docs/E2E_IMPLEMENTATION_SUMMARY.md) - Architecture details
- [API Documentation](./backend/src/api-spec/openapi.yaml) - OpenAPI specification
