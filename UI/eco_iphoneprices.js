const axios = require('axios');
const fs = require('fs');

// Fetch environment from command line argument
const env = process.argv[2];

// Define GraphQL API endpoint based on environment
let graphqlApi;
if (env === 'qa') {
    graphqlApi = "https://c5tckb695e.execute-api.us-east-1.amazonaws.com/prod/graphql";
} else if (env === 'prod') {
    graphqlApi = "https://39ylji254b.execute-api.us-east-1.amazonaws.com/prod/graphql";
} else {
    console.error("Invalid environment. Please specify either 'qa' or 'prod'.");
    process.exit(1);
}

let categoryId = "8fbcad05-0bbf-4ba7-ba0c-1d4f36bc1022";
let carrierName = "AT&T";
let latitude = "32.715736";
let Longitude = "-117.161087";

// Define grade combinations
const grades = [
    { name: 'A_YYY', powerUp: true, lcdOK: true, cracks: false },
    { name: 'B_NYY', powerUp: false, lcdOK: true, cracks: false },
    { name: 'C_YNY', powerUp: true, lcdOK: false, cracks: false },
    { name: 'D_NNY', powerUp: false, lcdOK: false, cracks: true },
    { name: 'E_YYN', powerUp: true, lcdOK: true, cracks: true },
    { name: 'F_NYN', powerUp: false, lcdOK: true, cracks: true },
    { name: 'G_YNN', powerUp: true, lcdOK: false, cracks: true },
    { name: 'H_NNN', powerUp: false, lcdOK: false, cracks: true }
];

// Define iPhone models with storage options and carrier
const iPhoneModels = [
    { modelName: "iPhone 15", seriesName: "iPhone 15", storageOption: "256GB", carrierName: carrierName },
    { modelName: "iPhone 15 Plus", seriesName: "iPhone 15 Plus", storageOption: "256GB", carrierName: carrierName },
    { modelName: "iPhone 15 Pro", seriesName: "iPhone 15 Pro", storageOption: "256GB", carrierName: carrierName },
    { modelName: "iPhone 15 Pro Max", seriesName: "iPhone 15 Pro Max", storageOption: "256GB", carrierName: carrierName }
];

const getPriceForiPhone = async (brandName, { modelName, seriesName, storageOption, carrierName }, { powerUp, lcdOK, cracks }) => {
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
        modelName,
        seriesName,
        storageOption,
        carrierName,
        powerUp,
        lcdOK,
        cracks,
        latitude,
        Longitude
    };

    try {
        const graphqlResponse = await axios.post(graphqlApi, {
            query: graphqlQuery,
            variables
        });
        const graphqlData = graphqlResponse.data.data.payout.offer;
        return graphqlData;
    } catch (error) {
        console.error("Error fetching price:", error);
        return null;
    }
};

const getAlliPhonePrices = async () => {
    const prices = [];
    for (const model of iPhoneModels) {
        for (const grade of grades) {
            const price = await getPriceForiPhone("Apple", model, grade);
            prices.push({
                modelName: model.modelName,
                seriesName: model.seriesName,
                storageOption: model.storageOption,
                carrierName: model.carrierName,
                grade: grade.name,
                price: price
            });
        }
    }
    return prices;
};

const writePricesToFile = async () => {
    const prices = await getAlliPhonePrices();
    const fileName = env === 'qa' ? 'qa_iphone_prices.json' : 'prod_iphone_prices.json';
    fs.writeFile(fileName, JSON.stringify(prices), (err) => {
        if (err) throw err;
        console.log(`iPhone prices saved to ${fileName}`);
    });
};

writePricesToFile();
