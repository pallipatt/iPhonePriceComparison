import { getBaseUrl } from "../../support/premium_price_utilities";

const env = Cypress.env("ENV");
const omni_api_base = getBaseUrl(env, "omni");
const graphqlApi = `${omni_api_base}/graphql`;

describe("Get eco and apple iphone prices", () => {
  let categoryId = "8fbcad05-0bbf-4ba7-ba0c-1d4f36bc1022";
  let carrierName = "UNCLOCKED";
  let latitude = "32.715736";
  let Longitude = "-117.161087";
  let powerUp = true;
  let lcdOK = true;
  let cracks = false;
  let premiumData = [];
  const applePrice = [];

  const sendGraphQLRequest = (brandName, seriesName, modelName, storageOption) => {
    const graphqlQuery = `
        query Payout($brandName: String!, $modelName: String!, $seriesName: String, $storageOption: String, $carrierName: String, $categoryId: ID, $powerUp: Boolean, $lcdOK: Boolean, $cracks: Boolean, $latitude: String, $longitude: String) {
  payout(brandName: $brandName, modelName: $modelName, seriesName: $seriesName, storageOption: $storageOption, carrierName: $carrierName, categoryId: $categoryId, powerUp: $powerUp, lcdOK: $lcdOK, cracks: $cracks, latitude: $latitude, longitude: $longitude) {
    deviceId
    offer
    offerId
    readyForSale
    __typename
    hybridPrice{
        basePrice
        hybridBonusUpTo
        totalPriceUpTo
    }
  }
}`;

    const variables = {
      brandName,
      categoryId,
      seriesName,
      modelName,
      storageOption,
      carrierName,
      powerUp,
      lcdOK,
      cracks,
      latitude,
      Longitude
    };

    cy.request({
      method: "POST",
      url: graphqlApi,
      body: {
        query: graphqlQuery,
        variables
      }
    }).then((graphqlResponse) => {
      expect(graphqlResponse.status).to.equal(200);
      const graphqlData = graphqlResponse.body.data.payout;
      expect(graphqlData.deviceId).to.not.be.null;
      // if (expectedHybridPriceNotNull) {
      // expect(graphqlData.hybridPrice).to.not.be.null;
      expect(graphqlData.offer).to.not.be.null;
      const ecoAtmPrice = parseInt(graphqlData.offer);

      premiumData.push({
        modelName,
        ecoAtmPrice
      });
    });
  };

  it("iPhone 7", () => {
    sendGraphQLRequest("Apple", "iPhone 7", "iPhone 7", "256GB");
  });
  it("iPhone 7 Plus", () => {
    sendGraphQLRequest("Apple", "iPhone 7 Plus", "iPhone 7 Plus", "256GB");
  });
  it("iPhone 8", () => {
    sendGraphQLRequest("Apple", "iPhone 8", "iPhone 8", "256GB");
  });
  it("iPhone 8 Plus", () => {
    sendGraphQLRequest("Apple", "iPhone 8 Plus", "iPhone 8 Plus", "256GB");
  });
  it("iPhone X", () => {
    sendGraphQLRequest("Apple", "iPhone X", "iPhone X", "256GB");
  });
  it("iPhone XR", () => {
    sendGraphQLRequest("Apple", "iPhone XR", "iPhone XR", "256GB");
  });
  it("iPhone XS", () => {
    sendGraphQLRequest("Apple", "iPhone XS", "iPhone XS", "512GB");
  });
  it("iPhone XS Max", () => {
    sendGraphQLRequest("Apple", "iPhone XS Max", "iPhone XS Max", "512GB");
  });
  it("iPhone 11", () => {
    sendGraphQLRequest("Apple", "iPhone 11", "iPhone 11", "256GB");
  });
  it("iPhone 11 Pro", () => {
    sendGraphQLRequest("Apple", "iPhone 11 Pro", "iPhone 11 Pro", "512GB");
  });
  it("iPhone 11 Pro Max", () => {
    sendGraphQLRequest("Apple", "iPhone 11 Pro Max", "iPhone 11 Pro Max", "512GB");
  });
  it("iPhone SE", () => {
    sendGraphQLRequest("Apple", "iphone SE", "iphone SE", "128GB");
  });
  it("iPhone 12 Mini", () => {
    sendGraphQLRequest("Apple", "iPhone 12 Mini", "iPhone 12 Mini", "256GB");
  });
  it("iPhone 12", () => {
    sendGraphQLRequest("Apple", "iPhone 12", "iPhone 12", "256GB");
  });
  it("iPhone 12 Pro", () => {
    sendGraphQLRequest("Apple", "iPhone 12 Pro", "iPhone 12 Pro", "512GB");
  });
  it("iPhone 12 Pro Max", () => {
    sendGraphQLRequest("Apple", "iPhone 12 Pro Max", "iPhone 12 Pro Max", "512GB");
  });
  it("iPhone 13 Mini", () => {
    sendGraphQLRequest("Apple", "iPhone 13 Mini", "iPhone 13 Mini", "512GB");
  });
  it("iPhone 13", () => {
    sendGraphQLRequest("Apple", "iPhone 13", "iPhone 13", "512GB");
  });
  it("iPhone 13 Pro", () => {
    sendGraphQLRequest("Apple", "iPhone 13 Pro", "iPhone 13 Pro", "1TB");
  });
  it("iPhone 13 Pro Max", () => {
    sendGraphQLRequest("Apple", "iPhone 13 Pro Max", "iPhone 13 Pro Max", "1TB");
  });
  it("iPhone SE (2022)", () => {
    sendGraphQLRequest("Apple", "iphone SE (2022)", "iphone SE (2022)", "256GB");
  });
  it("iPhone 14", () => {
    sendGraphQLRequest("Apple", "iPhone 14", "iPhone 14", "512GB");
  });
  it("iPhone 14 Plus", () => {
    sendGraphQLRequest("Apple", "iPhone 14 Plus", "iPhone 14 Plus", "512GB");
  });
  it("iPhone 14 Pro", () => {
    sendGraphQLRequest("Apple", "iPhone 14 Pro", "iPhone 14 Pro", "1TB");
  });
  it("iPhone 14 Pro Max", () => {
    sendGraphQLRequest("Apple", "iPhone 14 Pro Max", "iPhone 14 Pro Max", "1TB");
  });

  // it("iPhone 15", () => {
  //   sendGraphQLRequest("Apple", "iPhone 15", "iPhone 15", "512GB");
  // });
  // it("iPhone 15 Plus", () => {
  //   sendGraphQLRequest("Apple", "iPhone 15 Plus", "iPhone 15 Plus", "512GB");
  // });
  // it("iPhone 15 Pro", () => {
  //   sendGraphQLRequest("Apple", "iPhone 15 Pro", "iPhone 15 Pro", "1TB");
  // });
  // it("iPhone 15 Pro Max", () => {
  //   sendGraphQLRequest("Apple", "iPhone 15 Pro Max", "iPhone 15 Pro Max", "1TB");
  // });

  it("get all iphones prices from apple", () => {
    // Declare an array to store device names and values

    cy.visit("http://apple.com/shop/trade-in");
    cy.xpath("//a[contains(@href,'/iphone_values')]").click();

    // XPath to select the parent elements containing device names and values
    cy.xpath("//tbody[@class='t-eyebrow-reduced']/tr").each(($element, index) => {
      // Get device name and value from each row
      cy.wrap($element)
        .find("td")
        .then(($tds) => {
          const modelName = $tds.eq(0).text().trim(); // Assuming device name is in the first column
          const appleDevicePrice = $tds.eq(1).text().trim(); // Assuming device value is in the second column

          // Store device name and value in the applePrice array
          applePrice.push({ name: modelName, value: appleDevicePrice });
        });
    });
  });
  // After all tests are executed
  after(() => {
    cy.writeFile("eco.json", JSON.stringify(premiumData)).then(() => {
      console.log("Eco ATM prices have been written to eco.json");
      console.log(premiumData);
    });
    cy.writeFile("apple.json", JSON.stringify(applePrice)).then(() => {
      console.log("Apple ATM prices have been written to applePrice.json");
      console.log(applePrice);
    });
    premiumData.sort((a, b) => a.modelName.localeCompare(b.modelName));
    applePrice.sort((a, b) => a.name.localeCompare(b.name));

    // Combine the data into the desired format
    const combinedPrices = applePrice.map((applePrice, index) => {
      const ecoPrice = premiumData[index];
      return {
        id: index + 1,
        modelName: applePrice.name,
        applePrice: applePrice.value.split("$")[1],
        ecoPrice: ecoPrice.ecoAtmPrice
      };
    });
    cy.writeFile("data.json", JSON.stringify(combinedPrices)).then(() => {
      console.log("combined json array");
    });
  });
});
