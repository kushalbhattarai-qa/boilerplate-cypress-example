// cypress/support/commands/auth.commands.js

/**
 * LOGIN VIA UI
 * Navigates to /login and fills in credentials.
 */
Cypress.Commands.add("loginUI", (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.visit("/login");
      cy.get("[data-cy=email-input]").type(email);
      cy.get("[data-cy=password-input]").type(password, { log: false });
      cy.get("[data-cy=login-button]").click();
      cy.url().should("not.include", "/login");
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        cy.request("/api/me").its("status").should("eq", 200);
      },
    }
  );
});

/**
 * LOGIN VIA API (faster — bypasses the UI)
 * Sets cookies/localStorage directly from the API response.
 */
Cypress.Commands.add("loginAPI", (email, password) => {
  cy.session(
    ["api", email],
    () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("API_URL")}/auth/login`,
        body: { email, password },
        failOnStatusCode: true,
      }).then(({ body }) => {
        window.localStorage.setItem("auth_token", body.token);
        cy.setCookie("session_id", body.sessionId);
      });
    },
    { cacheAcrossSpecs: true }
  );
});

/**
 * LOGIN AS ADMIN shorthand
 */
Cypress.Commands.add("loginAsAdmin", () => {
  cy.loginAPI(Cypress.env("ADMIN_EMAIL"), Cypress.env("ADMIN_PASSWORD"));
});

/**
 * LOGOUT
 */
Cypress.Commands.add("logout", () => {
  cy.request("POST", `${Cypress.env("API_URL")}/auth/logout`);
  cy.clearCookies();
  cy.clearLocalStorage();
});
