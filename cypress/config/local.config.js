// cypress/config/local.config.js
module.exports = {
  baseUrl: "http://localhost:3000",
  env: {
    API_URL: "http://localhost:4000",
    ENV_NAME: "local",
  },
};
