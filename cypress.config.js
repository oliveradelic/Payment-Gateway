const { defineConfig } = require("cypress");

module.exports = defineConfig ({
   e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      baseUrl: 'https://eu-test.oppwa.com',
      accessToken: 'Bearer OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=',
      entityId: '8a8294174b7ecb28014b9699220015ca'
    },
  }, 
});
