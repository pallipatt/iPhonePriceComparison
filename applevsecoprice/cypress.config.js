const { defineConfig } = require("cypress");
const ini = require("ini");
const fs = require("fs");

// Get the credentials from the local machine if its not running from the jenkins.
if (!process.env.JENKINS_HOME) {
  const credentialsFile = fs.readFileSync(`${process.env.HOME || process.env.USERPROFILE}/.aws/credentials`, "utf-8");
  const credentials = ini.parse(credentialsFile);
  const qa_credentials_file = fs.readFileSync(
    `${process.env.HOME || process.env.USERPROFILE}/.qa_cypress/credentials`,
    "utf-8"
  );
  const qa_credentials = ini.parse(qa_credentials_file);

  process.env.AWS_ACCESS_KEY_ID = credentials.default.accessKeyId;
  process.env.AWS_SECRET_ACCESS_KEY = credentials.default.secretAccessKey;
}

module.exports = defineConfig({
  retries: {
    runMode: 2,
    openMode: 0
  },
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-json-results")({
        on,
        filename: "results.json"
      });
      const pluginConfigs = require("./cypress/plugins/index.js")(on);
      config.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
      config.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
      config.pluginConfigs = pluginConfigs;
      return config;
    }
  },
  video: false
});
