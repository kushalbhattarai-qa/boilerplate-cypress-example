// cypress/support/commands/ui.commands.js

/**
 * Click element by data-cy attribute (preferred selector strategy).
 */
Cypress.Commands.add("dataCy", (value) => {
  return cy.get(`[data-cy="${value}"]`);
});

/**
 * Type into a field and assert the value is set.
 */
Cypress.Commands.add("typeAndAssert", (selector, value) => {
  cy.get(selector).clear().type(value).should("have.value", value);
});

/**
 * Select a dropdown option by visible label text.
 */
Cypress.Commands.add("selectByText", (selector, text) => {
  cy.get(selector).select(text);
});

/**
 * Upload a file to an input[type=file].
 * @param {string} selector  - CSS selector for the file input
 * @param {string} filePath  - path relative to cypress/fixtures/
 */
Cypress.Commands.add("uploadFile", (selector, filePath, mimeType = "application/octet-stream") => {
  cy.fixture(filePath, "base64").then((fileContent) => {
    cy.get(selector).attachFile({ fileContent, filePath, mimeType, encoding: "base64" });
  });
});

/**
 * Assert a toast/snackbar notification message.
 */
Cypress.Commands.add("assertToast", (message, type = "success") => {
  cy.get(`[data-cy="toast-${type}"]`).should("be.visible").and("contain.text", message);
});

/**
 * Wait for a loading spinner to disappear.
 */
Cypress.Commands.add("waitForLoader", (selector = "[data-cy=loading-spinner]", timeout = 15000) => {
  cy.get(selector, { timeout }).should("not.exist");
});

/**
 * Scroll into view and click — useful for elements below the fold.
 */
Cypress.Commands.add("scrollAndClick", (selector) => {
  cy.get(selector).scrollIntoView().should("be.visible").click();
});

/**
 * Check accessibility (requires cypress-axe if you add it).
 * Gracefully skips if axe is not installed.
 */
Cypress.Commands.add("checkA11y", (context = null, options = {}) => {
  if (typeof cy.injectAxe === "function") {
    cy.injectAxe();
    cy.checkAccessibility(context, options);
  } else {
    cy.log("cypress-axe not installed — skipping a11y check");
  }
});

/**
 * Assert that a table row contains specific text in each column.
 * @param {number} rowIndex - 0-based row index
 * @param {string[]} cellTexts - expected text per cell
 */
Cypress.Commands.add("assertTableRow", (tableSelector, rowIndex, cellTexts) => {
  cy.get(`${tableSelector} tbody tr`)
    .eq(rowIndex)
    .within(() => {
      cellTexts.forEach((text, i) => {
        cy.get("td").eq(i).should("contain.text", text);
      });
    });
});

/**
 * Intercept and stub a network request with fixture data.
 */
Cypress.Commands.add("stubApi", (method, urlPattern, fixturePath, alias) => {
  cy.intercept(method, urlPattern, { fixture: fixturePath }).as(alias);
});
