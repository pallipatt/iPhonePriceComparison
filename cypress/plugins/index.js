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
