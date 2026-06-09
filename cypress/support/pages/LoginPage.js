// cypress/support/pages/LoginPage.js
// Page Object Model (POM) for the Login page.

class LoginPage {
  // ─── Selectors ────────────────────────────────────────────
  get emailInput()    { return cy.get("[data-cy=email-input]"); }
  get passwordInput() { return cy.get("[data-cy=password-input]"); }
  get loginButton()   { return cy.get("[data-cy=login-button]"); }
  get errorMessage()  { return cy.get("[data-cy=error-message]"); }
  get forgotLink()    { return cy.get("[data-cy=forgot-password-link]"); }

  // ─── Actions ──────────────────────────────────────────────
  visit() {
    cy.visit("/login");
    return this;
  }

  fillEmail(email) {
    this.emailInput.clear().type(email);
    return this;
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password, { log: false });
    return this;
  }

  submit() {
    this.loginButton.click();
    return this;
  }

  login(email, password) {
    return this.visit().fillEmail(email).fillPassword(password).submit();
  }

  // ─── Assertions ───────────────────────────────────────────
  assertErrorVisible(message) {
    this.errorMessage.should("be.visible");
    if (message) this.errorMessage.should("contain.text", message);
    return this;
  }

  assertRedirectedToDashboard() {
    cy.url().should("include", "/dashboard");
    return this;
  }
}

export default new LoginPage();
