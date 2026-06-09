// cypress/support/commands/api.commands.js

/**
 * Authenticated API request helper.
 * Automatically attaches the bearer token from localStorage.
 */
Cypress.Commands.add("apiRequest", (method, endpoint, body = null, options = {}) => {
  const token = window.localStorage.getItem("auth_token") || Cypress.env("AUTH_TOKEN");
  return cy.request({
    method,
    url: `${Cypress.env("API_URL")}${endpoint}`,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    failOnStatusCode: options.failOnStatusCode ?? true,
    ...options,
  });
});

/** GET shorthand */
Cypress.Commands.add("apiGet", (endpoint, options = {}) =>
  cy.apiRequest("GET", endpoint, null, options)
);

/** POST shorthand */
Cypress.Commands.add("apiPost", (endpoint, body, options = {}) =>
  cy.apiRequest("POST", endpoint, body, options)
);

/** PUT shorthand */
Cypress.Commands.add("apiPut", (endpoint, body, options = {}) =>
  cy.apiRequest("PUT", endpoint, body, options)
);

/** PATCH shorthand */
Cypress.Commands.add("apiPatch", (endpoint, body, options = {}) =>
  cy.apiRequest("PATCH", endpoint, body, options)
);

/** DELETE shorthand */
Cypress.Commands.add("apiDelete", (endpoint, options = {}) =>
  cy.apiRequest("DELETE", endpoint, null, options)
);

/**
 * Validate response schema against expected keys.
 * Usage: cy.apiGet('/users').validateSchema(['id', 'email', 'name'])
 */
Cypress.Commands.add("validateSchema", { prevSubject: true }, (response, requiredKeys) => {
  const body = response.body;
  const data = Array.isArray(body) ? body[0] : body;
  requiredKeys.forEach((key) => {
    expect(data, `Response should contain key: ${key}`).to.have.property(key);
  });
  return cy.wrap(response);
});

/**
 * Wait for an async job/task to complete by polling.
 * Usage: cy.waitForJobStatus('/jobs/123', 'completed')
 */
Cypress.Commands.add("waitForJobStatus", (endpoint, targetStatus, maxAttempts = 10, interval = 2000) => {
  function poll(attempt) {
    if (attempt >= maxAttempts) {
      throw new Error(`Job did not reach status '${targetStatus}' after ${maxAttempts} attempts`);
    }
    return cy.apiGet(endpoint).then((res) => {
      if (res.body.status === targetStatus) {
        return cy.wrap(res.body);
      }
      cy.wait(interval);
      return poll(attempt + 1);
    });
  }
  return poll(0);
});
