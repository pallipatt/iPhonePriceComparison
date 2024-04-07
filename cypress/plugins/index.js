/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// Use MicroSOft SQL to perform DB operations in your test
const sql = require("mssql");

// Create a connection config object
let config = {
  user: process.env.QA_MSSQL_USERNAME,
  password: process.env.QA_MSSQL_PASSWORD,
  server: "qaeco-rds-ssms.ecocorp.local",
  port: 1433,
  database: "ecoatm",
  trustServerCertificate: true
};

function queryTestDb(query) {
  return sql.connect(config).then((pool) => {
    return pool.request().query(query);
  });
}

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  on("task", {
    queryDb: (query) => {
      return queryTestDb(query);
    }
  });
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
};
