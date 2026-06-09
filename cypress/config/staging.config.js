// cypress/config/staging.config.js
module.exports = {
  baseUrl: "https://staging.your-app.com",
  env: {
    API_URL: "https://api.staging.your-app.com",
    ENV_NAME: "staging",
  },
};
