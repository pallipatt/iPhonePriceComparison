const env = Cypress.env("ENV");

let mwsApiUrl, omniApiUrl;

switch (env) {
  case "prod":
    mwsApiUrl = Cypress.env("MWS_PROD_API_URL");
    omniApiUrl = Cypress.env("OMNI_PROD_API_URL");
    break;
  default:
    mwsApiUrl = Cypress.env("MWS_QA_API_URL");
    omniApiUrl = Cypress.env("OMNI_QA_API_URL");
    break;
}

export function getAllBrands() {
  const query = `
        query Brands {
        brands {
            id
            name
        }
        }
    `;
  return cy.request({
    method: "POST",
    url: omniApiUrl,
    body: {
      query
    }
  });
}

export function getAllCategories() {
  const query = `
    query Categories {
        categories {
        id
        name
        }
    }
  `;
  return cy.request({
    method: "POST",
    url: omniApiUrl,
    body: {
      query
    }
  });
}

export function getAllDevices(brandId, brandName, categoryId) {
  return cy.request({
    method: "POST",
    url: omniApiUrl,
    body: {
      query: `
              query Series($brandId: ID!, $brandName: String!, $categoryId: ID!) {
                series(brandId: $brandId, brandName: $brandName, categoryId: $categoryId) {
                  id
                  name
                }
              }
            `,
      variables: {
        brandId: brandId,
        brandName: brandName,
        categoryId: categoryId
      }
    }
  });
}

export function getStorage(brandName, seriesName, modelName) {
  return cy.request({
    method: "POST",
    url: omniApiUrl,
    body: {
      query: `
            query StorageOptions($brandName: String!, $seriesName: String!, $modelName: String!) {
              storageOptions(brandName: $brandName, seriesName: $seriesName, modelName: $modelName) {
                id
                name
                __typename
              }
            }
            `,
      variables: {
        brandName: brandName,
        seriesName: seriesName,
        modelName: modelName
      }
    }
  });
}

export function getCarriers() {
  return cy.request({
    method: "POST",
    url: omniApiUrl,
    body: {
      query: `query Carriers {
      carriers {
        id
        name
        __typename
      }
    }`,
      variables: {}
    }
  });
}

export function getPayout(brandName, categoryId, seriesName, modelName, storageOption, carrierName) {
  return cy.request({
    method: "POST",
    url: omniApiUrl,
    body: {
      query: `query Payout($brandName: String!, $modelName: String!, $seriesName: String, $storageOption: String, $carrierName: String, $categoryId: ID, $powerUp: Boolean, $lcdOK: Boolean, $cracks: Boolean, $latitude: String, $longitude: String) {
      payout(brandName: $brandName, modelName: $modelName, seriesName: $seriesName, storageOption: $storageOption, carrierName: $carrierName, categoryId: $categoryId, powerUp: $powerUp, lcdOK: $lcdOK, cracks: $cracks, latitude: $latitude, longitude: $longitude) {
        deviceId
        offer
        offerId
        readyForSale
        __typename
      }
    }`,
      variables: {
        brandName: brandName,
        categoryId: categoryId,
        seriesName: seriesName,
        modelName: modelName,
        storageOption: storageOption,
        carrierName: carrierName,
        powerUp: true,
        lcdOK: true,
        cracks: false,
        latitude: "32.715736",
        Longitude: "-117.161087"
      }
    }
  });
}

export function getPayoutWithHybridPricing(
  brandName,
  categoryId = null,
  seriesName,
  modelName,
  storageOption,
  carrierName = null
) {
  if (!categoryId) {
    categoryId = "8fbcad05-0bbf-4ba7-ba0c-1d4f36bc1022";
  }
  if (!carrierName) {
    carrierName = "AT&T";
  }
  return cy.request({
    method: "POST",
    url: omniApiUrl,
    body: {
      query: `query Payout($brandName: String!, $modelName: String!, $seriesName: String, $storageOption: String, $carrierName: String, $categoryId: ID, $powerUp: Boolean, $lcdOK: Boolean, $cracks: Boolean, $latitude: String, $longitude: String) {
      payout(brandName: $brandName, modelName: $modelName, seriesName: $seriesName, storageOption: $storageOption, carrierName: $carrierName, categoryId: $categoryId, powerUp: $powerUp, lcdOK: $lcdOK, cracks: $cracks, latitude: $latitude, longitude: $longitude) {
        deviceId
        offer
        offerId
        readyForSale
        __typename
        hybridPrice {
          basePrice
          hybridBonusUpTo
          totalPriceUpTo
        }
      }
    }`,
      variables: {
        brandName: brandName,
        categoryId: categoryId,
        seriesName: seriesName,
        modelName: modelName,
        storageOption: storageOption,
        carrierName: carrierName,
        powerUp: true,
        lcdOK: true,
        cracks: false,
        latitude: "32.715736",
        Longitude: "-117.161087"
      }
    }
  });
}

export function getDropOffCode(carrierName, deviceId, email, offerId) {
  return cy.request({
    method: "POST",
    url: omniApiUrl,
    body: {
      query: `mutation DropOffCode($DeviceId: String!, $CarrierName: String, $scratches: Boolean, $cracks: Boolean, $codeType: String, $channelType: String, $GidType: String, $Gid: String, $OfferId: String, $Email: String) 
    {  
        dropOffCode(
            DeviceId: $DeviceId, 
            Gid: $Gid, 
            CarrierName: $CarrierName, 
            GidType: $GidType, 
            OfferId: $OfferId, 
            Email: $Email, 
            scratches: $scratches, 
            cracks: $cracks, 
            codeType: $codeType, 
            channelType: $channelType) 
            {    
                ChannelName    
                ClosestKioskId    
                Code    
                CreationDate    
                DevicePriceId    
                DeviceVsGroupPriceId    
                DeviceVsPidGroupPriceId    
                DropoffDeviceInfoId    
                DropoffPaymentMethodId    
                Email    
                EncryptedSecurityCode    
                ExpirationDate    
                GradeAlgorithm    
                GradeInfo {      
                    ConditionTestResults {        
                        Name        
                        Result        
                        __typename      
                    }      
                    __typename    
                }    
                Id    
                PaymentId1    
                PaymentId2    
                PaymentId3    
                Price    
                PriceGrade    
                PriceReferenceId    
                QuoteAlgorithm    
                SecurityCode    
                __typename  
        }
    }`,
      variables: {
        CarrierName: carrierName,
        DeviceId: deviceId,
        Email: email,
        OfferId: offerId,
        channelType: "Web",
        codeType: "W",
        cracks: false,
        scratches: false
      }
    }
  });
}

export function getDropOffCodeWithPaymentInfo(
  carrierName,
  deviceId,
  email,
  offerId,
  DropffPaymentMethodId,
  PaymentId1Value,
  PaymentId2Value,
  PaymentId3Value
) {
  return cy.request({
    method: "POST",
    url: omniApiUrl,
    body: {
      query: `mutation DropOffCode($DeviceId: String!, $CarrierName: String, $scratches: Boolean, $cracks: Boolean, $codeType: String, $channelType: String, $GidType: String, $Gid: String, $OfferId: String, $Email: String, $paymentInfo: PaymentInfoInput) 
{  
    dropOffCode(
        DeviceId: $DeviceId, 
        Gid: $Gid, 
        CarrierName: $CarrierName, 
        GidType: $GidType, 
        OfferId: $OfferId, 
        Email: $Email, 
        scratches: $scratches, 
        cracks: $cracks, 
        codeType: $codeType, 
        channelType: $channelType,
        paymentInfo: $paymentInfo)
        {    
            ChannelName    
            ClosestKioskId    
            Code    
            CreationDate    
            DevicePriceId    
            DeviceVsGroupPriceId    
            DeviceVsPidGroupPriceId    
            DropoffDeviceInfoId    
            DropoffPaymentMethodId    
            Email    
            EncryptedSecurityCode    
            ExpirationDate    
            GradeAlgorithm    
            GradeInfo {      
                ConditionTestResults {        
                    Name        
                    Result        
                    __typename      
                }      
                __typename    
            }    
            Id    
            PaymentId1    
            PaymentId2    
            PaymentId3    
            Price    
            PriceGrade    
            PriceReferenceId    
            QuoteAlgorithm    
            SecurityCode    
            __typename  
    }
}`,
      variables: {
        CarrierName: carrierName,
        DeviceId: deviceId,
        Email: email,
        OfferId: offerId,
        channelType: "Web",
        codeType: "W",
        cracks: false,
        scratches: false,
        paymentInfo: {
          DropffPaymentMethodId: DropffPaymentMethodId,
          PaymentId1Value: PaymentId1Value,
          PaymentId2Value: PaymentId2Value,
          PaymentId3Value: PaymentId3Value
        }
      }
    }
  });
}

export function getDropOffCodeEmail(createdAt, deviceId, email, expiryDate, kioskCode, offerId) {
  return cy.request({
    method: "POST",
    url: omniApiUrl,
    body: {
      query: `
            mutation DropoffCodeEmail($input: DropoffCodeEmailInput) {
              dropoffCodeEmail(input: $input)
            }
            `,
      variables: {
        input: {
          createdAt: createdAt,
          deviceId: deviceId,
          emailAddress: email,
          expiryDate: expiryDate,
          kioskCode: kioskCode,
          offerId: offerId
        }
      }
    }
  });
}

export function dateFormat(informatDate) {
  const milliseconds = parseInt(informatDate.slice(6, -2));
  const date = new Date(milliseconds);
  date.setUTCHours(date.getUTCHours());
  // Format the date to "Dec 28, 2023"
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  });
  return formattedDate;
}

export function getKioskCodeFromEmail(message) {
  const dropOffCodeMatch = message.match(/Drop-off code\s+([\w\d]+)/);
  const dropOffCode = dropOffCodeMatch ? dropOffCodeMatch[1] : "";
  return dropOffCode;
}

export function getOfferPriceFromEmail(message) {
  const offerPriceMatch = message.match(/\$ (\d+)/);
  const offerPrice = offerPriceMatch ? offerPriceMatch[1] : "";
  return offerPrice;
}

export function totalPriceUpToFromEmail(message) {
  const offerPriceMatch = message.match(/\$ (\d+)/);
  const offerPrice = offerPriceMatch ? parseFloat(offerPriceMatch[1]) : "";
  return offerPrice;
}

export function instantCashPriceFromEmail(message) {
  const instantPayRegex = /Get paid \*up to \$([0-9,]+)\* in InstantCash/;
  const instantCashMatch = instantPayRegex.exec(message);
  const instantCashOffer = instantCashMatch ? parseFloat(instantCashMatch[1]) : "";
  return instantCashOffer;
}

export function bonusPayoutPriceFromEmail(message) {
  const bonusPayRegex = /Get paid up to \$([\0-9.]+) BonusPay post inspection/;
  const bonusPayMatch = bonusPayRegex.exec(message);
  const bonusPayOfferPrice = bonusPayMatch ? parseFloat(bonusPayMatch[1]) : "";
  return bonusPayOfferPrice;
}

export function getExpireDateFromEmail(message) {
  let expireDate = "";
  const dateRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)+\s\d{1,2},\s\d{4}/;
  const dateMatch = dateRegex.exec(message);
  if (dateMatch && dateMatch.length > 0) {
    expireDate = dateMatch[0];
  }
  return expireDate;
}

export function getDeviceNameFromEmail(message) {
  const modelNameMatch = message.match(/-{5,}\n([\s\S]+?)\n-{5,}/);
  const deviceInfo = modelNameMatch ? modelNameMatch[1].trim() : "";
  const deviceName = deviceInfo.replace(/&amp;/g, "&");
  return deviceName;
}

export function mwsGetAllDeviceGroupsByBrandAndCategory(sessionToken, categoryId, brandId) {
  return cy.request({
    method: "GET",
    url: `${mwsApiUrl}/MobileApplication/GetAllDeviceGroupsByBrandAndCategory/session=${sessionToken}/categoryId=${categoryId}/brandId=${brandId}`
  });
}

export function mwsGetDevicePrice(deviceId) {
  return cy.getMwsSessionToken().then((sessionToken) => {
    cy.request({
      method: "POST",
      url: `${mwsApiUrl}/MobileApplication/GetDevicePrice/session=${sessionToken}/deviceId=${deviceId}`,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        powerUp: true,
        lcdOK: true,
        scratches: false,
        cracks: false
      }
    });
  });
}

export function createDynamoDBClient() {
  const AWS = require("aws-sdk");
  const accessKeyId = Cypress.env("AWS_ACCESS_KEY_ID");
  const secretAccessKey = Cypress.env("AWS_SECRET_ACCESS_KEY");
  const dynamoDBClient = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1",
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  });
  return dynamoDBClient;
}
