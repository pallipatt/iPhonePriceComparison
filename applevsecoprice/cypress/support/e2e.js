import "./commands";
const AWS = require("aws-sdk");
const accessKeyId = Cypress.env("AWS_ACCESS_KEY_ID");
const secretAccessKey = Cypress.env("AWS_SECRET_ACCESS_KEY");

before(() => {
  const envs = ["qa", "prod", "dev"];
  if (!Cypress.env("ENV") || !envs.includes(Cypress.env("ENV"))) {
    throw new Error(`invalid environment ${Cypress.env("ENV")}`);
  }
});

AWS.config.update({
  region: "us-west-2",
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
Cypress.env("dynamoDBClient", dynamoDBClient);
