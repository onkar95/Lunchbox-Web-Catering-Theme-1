const fs = require("fs-extra");
const path = require("path");
const iniq = require("inquirer");

const prompt = iniq.createPromptModule();

const argPass = process.argv.splice(2);

let clientName = argPass[0];

(async () => {
  if (!clientName) {
    const answer = await prompt([
      {
        name: "name",
        type: "input",
        message: "What is the client name",
        validate: async (ans) => {
          if (ans.length === 0) {
            return "Please enter a valid client name?";
          }

          if (ans.length > 0) {
            try {
              await fs.readdir(
                path.resolve(__dirname, `../clients/${ans.toLowerCase()}`),
              );
              return "This client already exist, please enter a valid non-existing client name?";
            } catch (error) {
              return true;
            }
          }
          return true;
        },
      },
    ]);
    clientName = answer.name;
  }

  if (clientName.length > 0) {
    try {
      await fs.readdir(
        path.resolve(__dirname, `../clients/${clientName.toLowerCase()}`),
      );
      console.log(
        "This client already exist, please enter a valid non-existing client name?",
      );
      return true;
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  if (clientName.length > 0) {
    fs.copySync(
      path.resolve(__dirname, "../clients/basetemplate"),
      path.resolve(__dirname, `../clients/${clientName.toLowerCase()}`),
    );
    const data = await fs.readFile(
      path.resolve(
        __dirname,
        `../clients/${clientName.toLowerCase()}/config/common.json`,
      ),
      "utf8",
    );
    const clientCommonConfig = JSON.parse(data);

    const smallCapClientName = clientName.toLowerCase();
    const capClientName = clientName[0].toUpperCase() + clientName.substring(1);

    // Replace base client id
    clientCommonConfig.id = smallCapClientName;

    // replace base client restaurant name
    clientCommonConfig.restaurant = capClientName;

    // Replace base client directory
    clientCommonConfig.directory = smallCapClientName;

    // Replace base client website name
    clientCommonConfig.website.name = clientCommonConfig.website.name.replace(
      "Basetemplate",
      capClientName,
    );

    // Replace base client website url
    clientCommonConfig.website.url = clientCommonConfig.website.url.replace(
      "basetemplate",
      smallCapClientName,
    );

    // Replace base client website url
    clientCommonConfig.website.favicons =
      clientCommonConfig.website.favicons.map((favico) => {
        return {
          ...favico,
          src: favico.src.replace("basetemplate", smallCapClientName),
        };
      });

    // Replace common.json with updated client name

    await fs.writeFile(
      path.resolve(
        __dirname,
        `../clients/${clientName.toLowerCase()}/config/common.json`,
      ),
      JSON.stringify(clientCommonConfig, null, 2),
      "utf8",
    );

    // Get current image.json data
    const images = await fs.readFile(
      path.resolve(
        __dirname,
        `../clients/${clientName.toLowerCase()}/config/images.json`,
      ),
      "utf8",
    );

    const clientImages = {};

    const imageConv = JSON.parse(images);

    // Get current image.json key-value pair and map through and replace client name
    Object.entries(imageConv).map((img) => {
      clientImages[img[0]] = img[1].replace("basetemplate", smallCapClientName);
      return img;
    });

    // Replace images.json with updated client name
    await fs.writeFile(
      path.resolve(
        __dirname,
        `../clients/${clientName.toLowerCase()}/config/images.json`,
      ),
      JSON.stringify(clientImages, null, 2),
      "utf8",
    );

    // Get client.json data
    const clientJSONData = await fs.readFile(
      path.resolve(__dirname, "./clients.json"),
      "utf8",
    );

    // parse the client list data to object
    const clientJSON = JSON.parse(clientJSONData);

    // push the new created client to client list array
    clientJSON.clients.push(clientName.toLowerCase());

    // remove duplicates
    clientJSON.clients = [...new Set(clientJSON.clients)];

    // Sort the client list alphabetically
    clientJSON.clients.sort();

    // replace the existing client.json with the update data
    await fs.writeFile(
      path.resolve(__dirname, "./clients.json"),
      JSON.stringify(clientJSON, null, 2),
      "utf8",
    );
  }
})();
