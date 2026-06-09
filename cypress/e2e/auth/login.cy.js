// cypress/e2e/auth/login.cy.js
import LoginPage from "../../support/pages/LoginPage";
import DashboardPage from "../../support/pages/DashboardPage";
import { faker } from "@faker-js/faker";

describe("Authentication", () => {
  // ─── Happy Path ───────────────────────────────────────────────────────────
  context("Valid credentials", () => {
    it("logs in with valid admin credentials", () => {
      LoginPage
        .login(Cypress.env("ADMIN_EMAIL"), Cypress.env("ADMIN_PASSWORD"))
        .assertRedirectedToDashboard();

      DashboardPage.assertLoaded();
    });

    it("persists session on page reload", () => {
      cy.loginAPI(Cypress.env("TEST_USER_EMAIL"), Cypress.env("TEST_USER_PASSWORD"));
      cy.visit("/dashboard");
      cy.reload();
      DashboardPage.assertLoaded();
    });
  });

  // ─── Negative Cases ───────────────────────────────────────────────────────
  context("Invalid credentials", () => {
    beforeEach(() => LoginPage.visit());

    it("shows error for wrong password", () => {
      LoginPage
        .fillEmail(Cypress.env("ADMIN_EMAIL"))
        .fillPassword("WrongPassword!")
        .submit()
        .assertErrorVisible("Invalid email or password");
    });

    it("shows error for non-existent user", () => {
      LoginPage
        .fillEmail(faker.internet.email())
        .fillPassword("SomePassword123!")
        .submit()
        .assertErrorVisible();
    });

    it("shows validation error for empty fields", () => {
      LoginPage.loginButton.click();
      cy.get("[data-cy=field-error]").should("have.length.at.least", 1);
    });

    it("shows validation error for invalid email format", () => {
      LoginPage
        .fillEmail("not-an-email")
        .fillPassword("Password123!")
        .submit();
      cy.get("[data-cy=email-error]").should("be.visible");
    });
  });

  // ─── Logout ───────────────────────────────────────────────────────────────
  context("Logout", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard");
    });

    it("logs out and redirects to login", () => {
      DashboardPage.logout();
      cy.url().should("include", "/login");
    });

    it("cannot access dashboard after logout", () => {
      DashboardPage.logout();
      cy.visit("/dashboard");
      cy.url().should("include", "/login");
    });
  });
});
