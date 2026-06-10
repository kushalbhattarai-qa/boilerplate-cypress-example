import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../../../support/pages/LoginPage";
import DashboardPage from "../../../support/pages/DashboardPage";

Given("the login page is open", () => {
  LoginPage.visit();
});

When("I sign in with valid admin credentials", () => {
  LoginPage
    .fillEmail(Cypress.env("ADMIN_EMAIL"))
    .fillPassword(Cypress.env("ADMIN_PASSWORD"))
    .submit();
});

When("I sign in with the admin email and password {string}", (password) => {
  LoginPage
    .fillEmail(Cypress.env("ADMIN_EMAIL"))
    .fillPassword(password)
    .submit();
});

When("I submit the login form without credentials", () => {
  LoginPage.loginButton.click();
});

Then("I should be taken to the dashboard", () => {
  LoginPage.assertRedirectedToDashboard();
  DashboardPage.assertLoaded();
});

Then("I should see the login error {string}", (message) => {
  LoginPage.assertErrorVisible(message);
});

Then("I should see required login field validation", () => {
  cy.get("[data-cy=field-error]").should("have.length.at.least", 1);
});
