# Automated QA System — Cypress Boilerplate

A production-ready Cypress test automation framework with multi-environment support, Page Object Model, custom commands, API testing helpers, and CI/CD integration.

---

## Project Structure

```
cypress-qa-boilerplate/
├── cypress/
│   ├── config/                  # Per-environment config files
│   │   ├── local.config.js
│   │   ├── staging.config.js
│   │   └── production.config.js
│   ├── e2e/                     # Test suites
│   │   ├── auth/
│   │   │   └── login.cy.js
│   │   ├── api/
│   │   │   └── users.api.cy.js
│   │   └── dashboard/
│   │       └── dashboard.cy.js
│   ├── fixtures/                # Static test data (JSON)
│   │   ├── users.json
│   │   └── dashboard/
│   │       └── stats.json
│   └── support/
│       ├── e2e.js               # Global hooks & imports
│       ├── commands/            # Custom Cypress commands
│       │   ├── auth.commands.js
│       │   ├── api.commands.js
│       │   └── ui.commands.js
│       └── pages/               # Page Object Models
│           ├── LoginPage.js
│           └── DashboardPage.js
├── .github/
│   └── workflows/
│       └── cypress.yml          # GitHub Actions CI
├── cypress.config.js
├── cypress.env.json.example
├── .eslintrc.json
└── package.json
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment secrets
cp cypress.env.json.example cypress.env.json
# Edit cypress.env.json with your credentials

# 3. Open Cypress in interactive mode
npm run cy:open

# 4. Run all tests headlessly
npm run cy:run
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm run cy:open` | Open Cypress Test Runner (interactive) |
| `npm run cy:run` | Run all tests headlessly |
| `npm run test:e2e` | Run all e2e specs |
| `npm run test:bdd` | Run Gherkin/Cucumber feature specs |
| `npm run test:api` | Run API-only tests |
| `npm run test:smoke` | Run smoke tests (`*.smoke.cy.js`) |
| `npm run test:regression` | Run regression tests (`*.regression.cy.js`) |
| `npm run test:ci` | Run with JUnit XML reporter (for CI) |

### Targeting an Environment

```bash
# Run against staging (default)
npx cypress run

# Run against production
npx cypress run --env ENV=production

# Run against local dev
npx cypress run --env ENV=local
```

---

## Custom Commands

### Auth Commands
```js
cy.loginUI(email, password)     // Login via the UI
cy.loginAPI(email, password)    // Login via API (faster)
cy.loginAsAdmin()               // Login with admin credentials from env
cy.logout()                     // Clear session
```

### API Commands
```js
cy.apiGet('/users')
cy.apiPost('/users', { name: 'Alice', email: 'alice@test.com' })
cy.apiPut('/users/1', { name: 'Updated' })
cy.apiPatch('/users/1', { role: 'admin' })
cy.apiDelete('/users/1')

// Schema validation
cy.apiGet('/users').validateSchema(['id', 'email', 'name'])

// Poll until job completes
cy.waitForJobStatus('/jobs/123', 'completed')
```

### UI Commands
```js
cy.dataCy('submit-button')           // Get by data-cy attribute
cy.typeAndAssert('#email', 'a@b.com') // Type and assert value
cy.assertToast('Saved!', 'success')  // Assert toast notification
cy.waitForLoader()                    // Wait for spinner to disappear
cy.stubApi('GET', '/api/users', 'users.json', 'usersRequest') // Stub API
```

---

## Page Object Model

```js
import LoginPage from "../../support/pages/LoginPage";

LoginPage
  .visit()
  .fillEmail('user@test.com')
  .fillPassword('Password123!')
  .submit()
  .assertRedirectedToDashboard();
```

---

## Fixtures

Place static JSON test data in `cypress/fixtures/`. Reference in tests:

```js
cy.fixture('users').then((users) => {
  // use users.users[0].email etc.
});

// Or stub an API with a fixture:
cy.intercept('GET', '/api/users', { fixture: 'users.json' });
```

---

## Selectors Strategy

This project uses `data-cy` attributes as the primary selector strategy — decoupled from styling and structure:

```html
<!-- In your app -->
<button data-cy="login-button">Sign In</button>
```

```js
// In your tests
cy.dataCy('login-button').click();
// or
cy.get('[data-cy="login-button"]').click();
```

---

## CI/CD (GitHub Actions)

Tests run automatically on push/PR to `main` and `develop`, and nightly via cron. Secrets are stored in GitHub repository secrets:

- `STAGING_BASE_URL`
- `STAGING_API_URL`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`

Artifacts (screenshots, videos, HTML report) are uploaded after each run.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `ENV` | Target environment (`local`/`staging`/`production`) | `staging` |
| `API_URL` | Base URL for API requests | — |
| `ADMIN_EMAIL` | Admin account email | — |
| `ADMIN_PASSWORD` | Admin account password | — |
| `AUTH_TOKEN` | Static bearer token (optional) | — |

---

## Adding New BDD Tests

1. Create a new feature file in `cypress/e2e/<feature>/<feature>.feature`
2. Add matching step definitions in `cypress/e2e/<feature>/step_definitions/*.steps.js`
3. Reuse Page Objects from `cypress/support/pages/` for UI actions and assertions
4. Add fixture data in `cypress/fixtures/` when test data should be shared
5. Use business-readable Gherkin steps and stable `data-cy` selectors

Example:

```gherkin
Feature: Authentication

  Scenario: Admin signs in with valid credentials
    Given the login page is open
    When I sign in with valid admin credentials
    Then I should be taken to the dashboard
```

---

## Reporting

```bash
# Generate HTML report after a run
npm run report:full

# Report is saved to cypress/reports/html/report.html
```
