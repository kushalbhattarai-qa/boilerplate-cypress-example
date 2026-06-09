// cypress/support/e2e.js - Global support file loaded before every test
import "./commands/auth.commands";
import "./commands/api.commands";
import "./commands/ui.commands";
import "cypress-mochawesome-reporter/register";
import "cypress-real-events/support";
import "@testing-library/cypress/add-commands";

before(() => {
  cy.log("Running tests on ENV: " + (Cypress.env("ENV_NAME") || "staging"));
});

beforeEach(() => {
  Cypress.Cookies.preserveOnce("session_id", "auth_token", "XSRF-TOKEN");
  cy.task("log", "Starting: " + Cypress.currentTest.title);
});

afterEach(function () {
  if (this.currentTest && this.currentTest.state === "failed") {
    cy.task("log", "FAILED: " + Cypress.currentTest.title);
  }
});

// Suppress known non-critical app errors
Cypress.on("uncaught:exception", (err) => {
  const ignoredErrors = [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
    "ChunkLoadError",
  ];
  if (ignoredErrors.some((msg) => err.message.includes(msg))) {
    return false;
  }
  return true;
});
