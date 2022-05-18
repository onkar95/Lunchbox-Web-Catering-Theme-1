const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const argPass = process.argv.splice(2);

const clientName = argPass[0];

const figmaWorkbookKey = {
    "Apple SSO Client ID": "apple",
    "Google SSO Key": "google",
    "Restaurant Name": "restaurant",
    "App Google Analytics Tag": "google_analytics",
    "App GTM Tag": "google_tag_manager",
    "Beam Production Key": "beam_impact",
    "Facebook Pixel": "facebook_pixel",
};

function checkIfDataExist(data) {
    if (data) {
        return data;
    }

    return "";
}

(async() => {
    if (!clientName) throw new Error(`Client: Please enter a valid client name`);

    const configPath = `../clients/${clientName.toLowerCase()}/config`;

    const commonJSONPath = path.resolve(__dirname, `${configPath}/common.json`);
    const productionJSONPath = path.resolve(
        __dirname,
        `${configPath}/production.json`,
    );

    const commonFiles = await fs.readFile(commonJSONPath, "utf8");
    const prodFiles = await fs.readFile(productionJSONPath, "utf8");

    const clientCommonFile = JSON.parse(commonFiles);
    const clientProdFile = JSON.parse(prodFiles);

    try {
        const resp = await axios.get(
            `${process.env.DELIVERY_API}?appId=${clientName}&platform=web`,
        );
        const { workbook } = resp.data;

        const workbookData = {};

        // fill common.json data
        Object.entries(workbook).forEach(([figmaKey, figmaValue]) => {
            if (figmaWorkbookKey[figmaKey]) {
                workbookData[figmaWorkbookKey[figmaKey]] = figmaValue;
            }
        });

        clientCommonFile.restaurant = checkIfDataExist(workbookData.restaurant);
        clientCommonFile.auth.apple.client_id = checkIfDataExist(
            workbookData.apple,
        );
        clientCommonFile.auth.google.client_id = checkIfDataExist(
            workbookData.google,
        );

        if (workbookData.apple) {
            clientCommonFile.auth.apple.enabled = true;
        }

        if (workbookData.google) {
            clientCommonFile.auth.google.enabled = true;
        }

        // fill production.json data
        clientProdFile.apps.google_analytics = checkIfDataExist(
            workbookData.google_analytics,
        );
        clientProdFile.apps.google_tag_manager = checkIfDataExist(
            workbookData.google_tag_manager,
        );
        clientProdFile.apps.facebook_pixel = checkIfDataExist(
            workbookData.facebook_pixel,
        );
        clientProdFile.apps.beam_impact = checkIfDataExist(
            workbookData.beam_impact,
        );

        // update common.json
        await fs.writeFile(
            commonJSONPath,
            JSON.stringify(clientCommonFile, null, 2),
            "utf8",
        );

        // update production.json
        await fs.writeFile(
            productionJSONPath,
            JSON.stringify(clientProdFile, null, 2),
            "utf8",
        );
    } catch (error) {
        console.log(error);
    }
})();