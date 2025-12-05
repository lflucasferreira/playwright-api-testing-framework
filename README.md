# 🎭 Playwright API Testing Framework

A comprehensive, production-ready API testing framework built with **Playwright** and **TypeScript**, demonstrating best practices for REST API automation testing.

[![API Tests](https://github.com/lflucasferreira/playwright-api-testing-framework/actions/workflows/api-tests.yml/badge.svg)](https://github.com/lflucasferreira/playwright-api-testing-framework/actions/workflows/api-tests.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40+-45ba4b?logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Description

This framework provides a scalable, maintainable solution for API testing with features including:

- **Token-based Authentication** handling with caching
- **CRUD Operations** testing (Create, Read, Update, Delete)
- **Data-driven Testing** with fixtures and factories
- **Custom Assertions** for API responses
- **CI/CD Integration** with GitHub Actions
- **Multiple Reporters** (HTML, JSON, JUnit)
- **TypeScript** for type safety and better IDE support

### Target API

This framework tests the [Restful-Booker API](https://restful-booker.herokuapp.com/apidoc/index.html), a sandbox API designed for practicing API testing.

## 📁 Folder Structure

```
playwright-api-testing-framework/
├── src/
│   ├── api/                    # API service classes
│   │   ├── base.api.ts         # Base class with HTTP methods
│   │   ├── auth.api.ts         # Authentication service
│   │   ├── booking.api.ts      # Booking CRUD operations
│   │   └── health.api.ts       # Health check service
│   ├── fixtures/               # Test data factories
│   │   ├── booking.fixtures.ts # Booking test data
│   │   └── auth.fixtures.ts    # Auth test data
│   ├── helpers/                # Utility functions
│   │   └── assertions.helper.ts # Custom assertions
│   └── types/                  # TypeScript interfaces
│       ├── booking.types.ts
│       └── auth.types.ts
├── tests/
│   ├── auth/                   # Authentication tests
│   ├── bookings/               # Booking CRUD tests
│   └── health/                 # Health check tests
├── .github/workflows/          # CI/CD pipelines
├── playwright.config.ts        # Playwright configuration
└── package.json
```

## 🚀 How to Run

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/lflucasferreira/playwright-api-testing-framework.git
cd playwright-api-testing-framework

# Install dependencies
npm install

# Install Playwright
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run regression tests
npm run test:regression

# Run specific test suites
npm run test:auth
npm run test:bookings
npm run test:health

# Run with UI mode
npx playwright test --ui

# View HTML report
npm run report
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
API_BASE_URL=https://restful-booker.herokuapp.com
API_USERNAME=admin
API_PASSWORD=password123
```

## 🧪 How to Test

### Test Categories

| Tag | Description | Command |
|-----|-------------|---------|
| `@smoke` | Critical path tests | `npm run test:smoke` |
| `@regression` | Full regression suite | `npm run test:regression` |
| `@security` | Security/auth tests | `npx playwright test --grep @security` |

### Test Coverage

- **Authentication**: Token generation, validation, caching
- **Booking CRUD**: Create, Read, Update (PUT/PATCH), Delete
- **Validation**: Data types, boundaries, special characters
- **Authorization**: Protected endpoints, token verification
- **Health Checks**: API availability, response times

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| [Playwright](https://playwright.dev/) | Test framework & HTTP client |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Node.js](https://nodejs.org/) | Runtime environment |
| [ESLint](https://eslint.org/) | Code linting |
| [Prettier](https://prettier.io/) | Code formatting |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |

## 📊 Reporting

Multiple report formats are generated:

- **HTML Report**: Interactive report at `reports/html-report/`
- **JSON Report**: Machine-readable at `reports/test-results.json`
- **JUnit XML**: CI integration at `reports/junit-results.xml`

View the HTML report:
```bash
npm run report
```

## 🏗️ Architecture

### Service Layer Pattern

```typescript
// API services encapsulate HTTP operations
const bookingAPI = new BookingAPI(request);
const { response, data } = await bookingAPI.createBooking(bookingData);
```

### Factory Pattern for Test Data

```typescript
// Fixtures provide consistent test data
const booking = createValidBooking({ firstname: 'Custom' });
const scenarios = bookingScenarios.businessTrip;
```

### Custom Assertions

```typescript
// Helper functions for common assertions
assertStatusCode(response, 200);
assertValidBookingResponse(data);
assertBookingEquals(actual, expected);
```

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing code style (ESLint + Prettier)
4. Write tests for new functionality
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Commands

```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Lucas Ferreira**
- GitHub: [@lflucasferreira](https://github.com/lflucasferreira)
- LinkedIn: [lflucasferreira](https://www.linkedin.com/in/lflucasferreira/)

---

⭐ If you found this project useful, please consider giving it a star!

