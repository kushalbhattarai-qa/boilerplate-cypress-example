const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // ─── Reporter ──────────────────────────────────────────────
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportPageTitle: "QA Automation Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportDir: "cypress/reports/html",
  },

  // ─── General Settings ──────────────────────────────────────
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  responseTimeout: 30000,
  pageLoadTimeout: 60000,
  video: true,
  videoCompression: 32,
  screenshotOnRunFailure: true,
  screenshotsFolder: "cypress/reports/screenshots",
  videosFolder: "cypress/reports/videos",
  retries: {
    runMode: 2,    // retries in CI
    openMode: 0,   // retries in interactive mode
  },

  // ─── E2E Config ─────────────────────────────────────────────
  e2e: {
    baseUrl: process.env.BASE_URL || "https://your-app.com",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    experimentalStudio: true,

    setupNodeEvents(on, config) {
      // ── Reporter plugin ──────────────────────────────────────
      require("cypress-mochawesome-reporter/plugin")(on);

      // ── Environment-based config overrides ──────────────────
      const env = config.env.ENV || "staging";
      const envConfig = require(`./cypress/config/${env}.config.js`);
      config.baseUrl = envConfig.baseUrl;
      config.env = { ...config.env, ...envConfig.env };

      // ── Task: log to terminal ────────────────────────────────
      on("task", {
        log(message) {
          console.log(`[CYPRESS TASK] ${message}`);
          return null;
        },
        table(tableData) {
          console.table(tableData);
          return null;
        },
      });

      return config;
    },
  },

  // ─── Environment Variables ──────────────────────────────────
  env: {
    ENV: "staging",
    API_URL: process.env.API_URL || "https://api.your-app.com",
    AUTH_TOKEN: process.env.AUTH_TOKEN || "",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@example.com",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "AdminPassword123!",
    TEST_USER_EMAIL: process.env.TEST_USER_EMAIL || "testuser@example.com",
    TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD || "TestPassword123!",
  },
});
