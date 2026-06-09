// cypress/e2e/dashboard/dashboard.cy.js
import DashboardPage from "../../support/pages/DashboardPage";

describe("Dashboard", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    DashboardPage.visit();
  });

  it("loads the dashboard page successfully", () => {
    DashboardPage.assertLoaded();
  });

  it("displays stats cards", () => {
    DashboardPage.statsCards.should("be.visible");
  });

  it("navigates to the Users section", () => {
    DashboardPage.navigateTo("users");
    cy.url().should("include", "/users");
  });

  it("intercepts and stubs the stats API", () => {
    // Stub before visiting
    cy.stubApi("GET", "/api/stats", "dashboard/stats.json", "statsRequest");
    DashboardPage.visit();
    cy.wait("@statsRequest").its("response.statusCode").should("eq", 200);
  });
});
