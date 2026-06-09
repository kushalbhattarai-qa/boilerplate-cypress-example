// cypress/e2e/api/users.api.cy.js
// Pure API tests - no UI involved.

import { faker } from "@faker-js/faker";

describe("Users API", () => {
  let createdUserId;

  before(() => {
    cy.loginAsAdmin();
  });

  // ─── GET ──────────────────────────────────────────────────────────────────
  describe("GET /users", () => {
    it("returns 200 with a list of users", () => {
      cy.apiGet("/users").then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.greaterThan(0);
      });
    });

    it("response items have required schema", () => {
      cy.apiGet("/users").validateSchema(["id", "email", "name", "role", "createdAt"]);
    });

    it("supports pagination params", () => {
      cy.apiGet("/users?page=1&limit=5").then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.length).to.be.lte(5);
      });
    });
  });

  // ─── POST ─────────────────────────────────────────────────────────────────
  describe("POST /users", () => {
    const newUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: "viewer",
    };

    it("creates a new user and returns 201", () => {
      cy.apiPost("/users", newUser).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property("id");
        expect(res.body.email).to.eq(newUser.email.toLowerCase());
        createdUserId = res.body.id;
      });
    });

    it("returns 400 for missing required fields", () => {
      cy.apiPost("/users", { name: "No Email" }, { failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.errors).to.be.an("array");
      });
    });

    it("returns 409 for duplicate email", () => {
      cy.apiPost("/users", newUser, { failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(409);
      });
    });
  });

  // ─── DELETE ───────────────────────────────────────────────────────────────
  describe("DELETE /users/:id", () => {
    it("deletes the created user and returns 204", function () {
      if (!createdUserId) this.skip();
      cy.apiDelete(`/users/${createdUserId}`).then((res) => {
        expect(res.status).to.eq(204);
      });
    });

    it("returns 404 for non-existent user", () => {
      cy.apiDelete("/users/non-existent-id-999", { failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });
});
