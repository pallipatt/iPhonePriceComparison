export function getBaseUrl(env, type) {
  if (type === "omni") {
    if (env === "qa") {
      return Cypress.env("OMNI_QA_API_URL");
    } else if (env === "prod") {
      return Cypress.env("OMNI_PROD_API_URL");
    } else {
      return null;
    }
  } else if (type === "mws") {
    if (env === "qa") {
      return Cypress.env("MWS_QA_API_URL");
    } else if (env === "prod") {
      return Cypress.env("MWS_PROD_API_URL");
    } else {
      return null;
    }
  } else {
    return null;
  }
}
