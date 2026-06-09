// cypress/support/pages/DashboardPage.js

class DashboardPage {
  // ─── Selectors ────────────────────────────────────────────
  get heading()      { return cy.get("[data-cy=dashboard-heading]"); }
  get navbar()       { return cy.get("[data-cy=navbar]"); }
  get userMenu()     { return cy.get("[data-cy=user-menu]"); }
  get logoutButton() { return cy.get("[data-cy=logout-button]"); }
  get statsCards()   { return cy.get("[data-cy=stats-card]"); }

  // ─── Actions ──────────────────────────────────────────────
  visit() {
    cy.visit("/dashboard");
    return this;
  }

  openUserMenu() {
    this.userMenu.click();
    return this;
  }

  logout() {
    this.openUserMenu();
    this.logoutButton.click();
    return this;
  }

  navigateTo(section) {
    cy.get(`[data-cy=nav-${section}]`).click();
    return this;
  }

  // ─── Assertions ───────────────────────────────────────────
  assertLoaded() {
    this.heading.should("be.visible");
    cy.url().should("include", "/dashboard");
    return this;
  }

  assertStatsCount(count) {
    this.statsCards.should("have.length", count);
    return this;
  }
}

export default new DashboardPage();
