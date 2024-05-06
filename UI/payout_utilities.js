export function getBaseUrhybridEligibility(env) {
    if (env === "qa") {
      return Cypress.env("HYBRID_ELIGIBILITY_QA_LAMBDA");
    } else if (env === "prod") {
      return Cypress.env("HYBRID_ELIGIBILITY_PROD_LAMBDA");
    } else {
      return null;
    }
  }
  
  export function getBaseUrlOmni(env) {
    if (env === "qa") {
      return Cypress.env("OMNI_QA_API_URL");
    } else if (env === "prod") {
      return Cypress.env("OMNI_PROD_API_URL");
    } else {
      return null;
    }
  }
  