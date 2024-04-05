// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

const env = Cypress.env("ENV");

const sinch_url = Cypress.env("SINCH_URL");
const sinch_auth_token = Cypress.env("QA_SINCH_AUTH_TOKEN");
const qa_comm_eng_client_id = Cypress.env("QA_COMM_ENG_CLIENT_ID");
const qa_comm_eng_client_secret = Cypress.env("QA_COMM_ENG_CLIENT_SECRET");
const prod_comm_eng_client_id = Cypress.env("PROD_COMM_ENG_CLIENT_ID");
const prod_comm_eng_client_secret = Cypress.env("PROD_COMM_ENG_CLIENT_SECRET");
const qa_payment_eng_client_id = Cypress.env("QA_PAYMENT_ENG_CLIENT_ID");
const qa_payment_eng_client_secret = Cypress.env("QA_PAYMENT_ENG_CLIENT_SECRET");
const prod_payment_eng_client_id = Cypress.env("PROD_PAYMENT_ENG_CLIENT_ID");
const prod_payment_eng_client_secret = Cypress.env("PROD_PAYMENT_ENG_CLIENT_SECRET");
const dev_payment_eng_client_id = Cypress.env("DEV_PAYMENT_ENG_CLIENT_ID");
const dev_payment_eng_client_secret = Cypress.env("DEV_PAYMENT_ENG_CLIENT_SECRET");
const qa_opensearch_vpc_url = Cypress.env("QA_OPENSEARCH_VPC_URL");
const prod_opensearch_vpc_url = Cypress.env("PROD_OPENSEARCH_VPC_URL");
const environment = Cypress.env("ENV");

Cypress.Commands.add("queryOpenSearchWorkbench", ({ query }) => {
  let baseURL;

  if (environment == "qa") {
    baseURL = qa_opensearch_vpc_url;
  } else if (environment == "prod") {
    baseURL = prod_opensearch_vpc_url;
  }

  return cy
    .request({
      method: "POST",
      url: baseURL,
      body: { query },
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.body);
});

Cypress.Commands.add("generateRandomEmail", () => {
  const randUserName = Cypress._.random(0, 999999);
  const domain = "example.com"; // Change this to your desired domain
  const email = `user${randUserName}@${domain}`;
  return email;
});

Cypress.Commands.add("getCommEngAccessToken", (env) => {
  const grantType = "client_credentials";
  const scope =
    "communication.ecoatm.com/email.send communication.ecoatm.com/verification.send communication.ecoatm.com/verification.check";
  const accessTokenUrl = `https://${env}-a2a-user-pool.auth.us-west-2.amazoncognito.com/oauth2/token`;
  const requestBody = {
    grant_type: grantType,
    scope: scope
  };
  let authHeader = "";
  if (env == "qa") {
    authHeader = `Basic ${btoa(`${qa_comm_eng_client_id}:${qa_comm_eng_client_secret}`)}`;
  } else if (env == "prod") {
    authHeader = `Basic ${btoa(`${prod_comm_eng_client_id}:${prod_comm_eng_client_secret}`)}`;
  }

  cy.request({
    method: "POST",
    url: accessTokenUrl,
    form: true,
    body: requestBody,
    headers: {
      Authorization: authHeader
    }
  }).then((response) => {
    return response.body.access_token;
  });
});

// QA = LIVE  DEV = SANDBOX
Cypress.Commands.add("getPaymentEngAccessToken", (env) => {
  const grantType = "client_credentials";
  const scope = "payment.ecoatm.com/payment.all";
  const accessTokenUrl = `https://${env}-a2a-user-pool.auth.us-west-2.amazoncognito.com/oauth2/token`;
  const requestBody = {
    grant_type: grantType,
    scope: scope
  };
  let authHeader = "";
  if (env == "qa") {
    authHeader = `Basic ${btoa(`${qa_payment_eng_client_id}:${qa_payment_eng_client_secret}`)}`;
  } else if (env == "dev") {
    authHeader = `Basic ${btoa(`${dev_payment_eng_client_id}:${dev_payment_eng_client_secret}`)}`;
  } else if (env == "prod") {
    authHeader = `Basic ${btoa(`${prod_payment_eng_client_id}:${prod_payment_eng_client_secret}`)}`;
  }

  cy.request({
    method: "POST",
    url: accessTokenUrl,
    form: true,
    body: requestBody,
    headers: {
      Authorization: authHeader
    }
  }).then((response) => {
    return response.body.access_token;
  });
});

Cypress.Commands.add("getPromocodeEngAccessToken", (env) => {
  const grantType = "client_credentials";
  const accessTokenUrl = `https://${env}-a2a-user-pool.auth.us-west-2.amazoncognito.com/oauth2/token`;
  const requestBody = {
    grant_type: grantType
  };
  let authHeader = "";
  if (env == "qa") {
    authHeader = `Basic ${btoa(`${qa_comm_eng_client_id}:${qa_comm_eng_client_secret}`)}`;
  } else if (env == "prod") {
    authHeader = `Basic ${btoa(`${prod_comm_eng_client_id}:${prod_comm_eng_client_secret}`)}`;
  }
  cy.request({
    method: "POST",
    url: accessTokenUrl,
    form: true,
    body: requestBody,
    headers: {
      Authorization: authHeader
    }
  }).then((response) => {
    return response.body.access_token;
  });
});

Cypress.Commands.add("cognitoAccessToken", (scopeType = null) => {
  const requestBody = {
    grant_type: "client_credentials"
  };
  if (scopeType) {
    switch (scopeType) {
      case "dropOffCode":
        requestBody.scope = "dropoffcodes.ecoatm.com/dropoffcode.write";
        break;
      case "promoCode":
        requestBody.scope = "promo.ecoatm.com/promo.all";
        break;
      case "paymentEngine":
        requestBody.scope = "payment.ecoatm.com/payment.all";
        break;
      case "paymentEngineWrite":
        requestBody.scope = "common.ecoatm.com/schedule.write";
        break;
      case "commEngine":
        requestBody.scope =
          "communication.ecoatm.com/email.send communication.ecoatm.com/verification.send communication.ecoatm.com/verification.check";
        break;
      case "allScopes":
        requestBody.scope =
          "payment.ecoatm.com/payment.all communication.ecoatm.com/email.send communication.ecoatm.com/verification.send communication.ecoatm.com/verification.check promo.ecoatm.com/promo.all dropoffcodes.ecoatm.com/dropoffcode.write";
        break;
    }
  }

  let authHeader = `Basic ${btoa(`${qa_comm_eng_client_id}:${qa_comm_eng_client_secret}`)}`;
  if (environment == "prod") {
    authHeader = `Basic ${btoa(`${prod_comm_eng_client_id}:${prod_comm_eng_client_secret}`)}`;
  }

  cy.request({
    method: "POST",
    url: `https://${environment}-a2a-user-pool.auth.us-west-2.amazoncognito.com/oauth2/token`,
    form: true,
    body: requestBody,
    headers: {
      Authorization: authHeader
    }
  }).then((response) => {
    return response.body.access_token;
  });
});

Cypress.Commands.add("getCommonApiAccessToken", (env) => {
  const grantType = "client_credentials";
  const scope = "common.ecoatm.com/schedule.write";
  const accessTokenUrl = `https://${env}-a2a-user-pool.auth.us-west-2.amazoncognito.com/oauth2/token`;
  const requestBody = {
    grant_type: grantType,
    scope: scope
  };
  let authHeader = "";
  if (env == "qa") {
    authHeader = `Basic ${btoa(`${qa_payment_eng_client_id}:${qa_payment_eng_client_secret}`)}`;
  } else if (env == "dev") {
    authHeader = `Basic ${btoa(`${dev_payment_eng_client_id}:${dev_payment_eng_client_secret}`)}`;
  } else if (env == "prod") {
    authHeader = `Basic ${btoa(`${prod_payment_eng_client_id}:${prod_payment_eng_client_secret}`)}`;
  }

  cy.request({
    method: "POST",
    url: accessTokenUrl,
    form: true,
    body: requestBody,
    headers: {
      Authorization: authHeader
    }
  }).then((response) => {
    return response.body.access_token;
  });
});

Cypress.Commands.add("createTempMail", () => {
  cy.wait(1500);
  cy.request("GET", "https://api.mail.tm/domains?page=1").then((response) => {
    const domain = response.body["hydra:member"][0].domain;
    const randomString = Math.random().toString(36).substring(7);
    const address = `${randomString}@${domain}`;
    cy.wait(1500);
    cy.request({
      method: "POST",
      url: "https://api.mail.tm/accounts",
      body: {
        address: address,
        password: "P@ssword123!"
      },
      failOnStatusCode: false
    }).then((response) => {
      const emailAddress = response.body.address;
      return emailAddress;
    });
  });
});

export function getAllMessages(authToken) {
  return cy
    .request({
      method: "GET",
      url: "https://api.mail.tm/messages",
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    .then((response) => {
      const result = {
        messageId:
          response.body &&
          response.body["hydra:member"] &&
          response.body["hydra:member"][0] &&
          response.body["hydra:member"][0].id,
        totalNumberOfMessages: response.body && response.body["hydra:totalItems"]
      };
      return result;
    });
}

Cypress.Commands.add("tempMailGetLatestEmail", (address, expectedNumberOfMessages = 1) => {
  cy.wait(1500);
  cy.request({
    method: "POST",
    url: "https://api.mail.tm/token",
    body: {
      address: address,
      password: "P@ssword123!"
    }
  }).then((response) => {
    const authToken = response.body.token;
    cy.wait(4500);
    getAllMessages(authToken).then((response) => {
      let messageId = response.messageId;
      let totalNumberOfMessages = response.totalNumberOfMessages;
      // If the messageId is null or undefined, OR
      // If the value of expectedNumberOfMessages is less than totalNumberOfMessages, then it will be retried.
      if (!messageId || totalNumberOfMessages < expectedNumberOfMessages) {
        cy.wait(10000);
        getAllMessages(authToken).then((response) => {
          messageId = response.messageId;
          totalNumberOfMessages = response.totalNumberOfMessages;
          if (!messageId || totalNumberOfMessages < expectedNumberOfMessages) {
            cy.wait(15000);
            getAllMessages(authToken).then((response) => {
              messageId = response.messageId;
              totalNumberOfMessages = response.totalNumberOfMessages;
              cy.wait(1000);
              cy.request({
                method: "GET",
                url: `https://api.mail.tm/messages/${messageId}`,
                headers: {
                  Authorization: `Bearer ${authToken}`
                }
              }).then((response) => {
                const output = {
                  address: address,
                  totalNumberOfMessages: totalNumberOfMessages,
                  subject: response.body && response.body.subject,
                  text: response.body && response.body.text,
                  html: response.body && response.body.html,
                  attachments: response.body && response.body.attachments
                };
                return output;
              });
            });
          } else {
            cy.wait(1000);
            cy.request({
              method: "GET",
              url: `https://api.mail.tm/messages/${messageId}`,
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            }).then((response) => {
              const output = {
                address: address,
                totalNumberOfMessages: totalNumberOfMessages,
                subject: response.body && response.body.subject,
                text: response.body && response.body.text,
                html: response.body && response.body.html,
                attachments: response.body && response.body.attachments
              };
              return output;
            });
          }
        });
      } else {
        cy.wait(1000);
        cy.request({
          method: "GET",
          url: `https://api.mail.tm/messages/${messageId}`,
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }).then((response) => {
          const output = {
            address: address,
            totalNumberOfMessages: totalNumberOfMessages,
            subject: response.body && response.body.subject,
            text: response.body && response.body.text,
            html: response.body && response.body.html,
            attachments: response.body && response.body.attachments
          };
          return output;
        });
      }
    });
  });
});

// finding the lenght of the sms's before sending a new sms
Cypress.Commands.add("sinchRetrieveMessageCount", (sinch_number) => {
  cy.request({
    method: "GET",
    url: sinch_url,
    qs: { to: sinch_number },
    headers: {
      Authorization: `Bearer ${sinch_auth_token}`
    }
  }).then((sinchResponse) => {
    // Extract the verification code from Sinch's response
    const currentLength = sinchResponse.body.length;
    return currentLength;
  });
});

// retrieving the new verification sms upon first checking if the length is incremented or nnt
Cypress.Commands.add("sinchRetrieveVerificationCode", (old_length_of_sms, sinch_number) => {
  cy.request({
    method: "GET",
    url: sinch_url,
    qs: { to: sinch_number },
    headers: {
      Authorization: `Bearer ${sinch_auth_token}`
    }
  }).then((sinchResponse) => {
    const new_lenght_of_sms = sinchResponse.body.length;

    // if the new length isn't greater than the old length, wait extra 10 seconds then send another request
    if (new_lenght_of_sms == old_length_of_sms) {
      cy.wait(5000);
      cy.request({
        method: "GET",
        url: sinch_url,
        headers: {
          Authorization: `Bearer ${sinch_auth_token}`
        }
      }).then((sinchResponse) => {
        const verificationCodeMatch = sinchResponse.body.inbounds[0].body.match(/\d{6}/)[0];
        return verificationCodeMatch;
      });
    } else {
      const verificationCodeMatch = sinchResponse.body.inbounds[0].body.match(/\d{6}/)[0];
      return verificationCodeMatch;
    }
  });
});

Cypress.Commands.add("getMwsSessionToken", () => {
  let baseUrl, userName, passWord;
  if (env == "qa") {
    baseUrl = Cypress.env("MWS_QA_API_URL");
    userName = Cypress.env("QA_MWS_USERNAME");
    passWord = Cypress.env("QA_MWS_PASSWORD");
  } else if (env == "prod") {
    baseUrl = Cypress.env("MWS_PROD_API_URL");
    userName = Cypress.env("PROD_MWS_USERNAME");
    passWord = Cypress.env("PROD_MWS_PASSWORD");
  }
  const requestData = {
    method: "POST",
    url: `${baseUrl}/Authentication/Login`,
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      logininfo: {
        email: userName,
        password: passWord
      }
    }
  };
  cy.request(requestData).then((response) => {
    expect(response.status).to.eq(200);
    let sessionToken = response.body;
    if (sessionToken === null || sessionToken === "") {
      cy.request(requestData).then((response) => {
        expect(response.status).to.eq(200);
        sessionToken = response.body;
      });
    }
    return sessionToken;
  });
});

Cypress.Commands.add("getLocationEngAccessToken", (env) => {
  const grantType = "client_credentials";
  const accessTokenUrl = `https://${env}-a2a-user-pool.auth.us-west-2.amazoncognito.com/oauth2/token`;
  const requestBody = {
    grant_type: grantType
  };
  let authHeader = "";
  if (env == "qa") {
    authHeader = `Basic ${btoa(`${qa_comm_eng_client_id}:${qa_comm_eng_client_secret}`)}`;
  } else if (env == "prod") {
    authHeader = `Basic ${btoa(`${prod_comm_eng_client_id}:${prod_comm_eng_client_secret}`)}`;
  }

  cy.request({
    method: "POST",
    url: accessTokenUrl,
    form: true,
    body: requestBody,
    headers: {
      Authorization: authHeader
    }
  }).then((response) => {
    return response.body.access_token;
  });
});
