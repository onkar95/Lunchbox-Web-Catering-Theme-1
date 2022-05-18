/* eslint-disable no-await-in-loop */
const fs = require("fs-extra");
const path = require("path");
const aws = require("aws-sdk");
const dotenv = require("dotenv");
const util = require("util");
const axios = require("axios");
const exec = util.promisify(require("child_process").exec);

dotenv.config();

const argPass = process.argv.splice(2);

const clientName = argPass[0];

aws.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const S3 = new aws.S3();

const validFontExtensions = ["otf", "ttf", "woff"];
const isValidFont = (fontName) => {
  const [, fontExt] = fontName.split(".");
  return validFontExtensions.includes(fontExt);
};

function selectFontType(font) {
  switch (font) {
    case "otf":
      return "opentype";
    case "woff":
      return "woff";
    case "ttf":
      return "truetype";
    default:
      return "";
  }
}

const storageFontPath = "/tmp/fontDb.txt";
const s3FontURL = "https://assets.lunchbox.io/shared/fonts";

async function getDownloadedAssets(url) {
  await exec(`curl -L -o /tmp/client.zip "${url}"`);
  await exec(`unzip /tmp/client.zip -d /tmp/client`);
  await exec(
    `curl -L -o ${storageFontPath} "https://s3.amazonaws.com/assets.lunchbox.io/fonts/fontDb.txt"`,
  );
  // get font uploaded list from S3 bucket
  const storageFont = await fs.readFile(storageFontPath);
  const fontArray = storageFont.toString().split("\n");

  // get the list of fonts in the downloaded font folders
  const fontFiles = await fs.readdir(path.resolve(`/tmp/client/fonts`));

  return {
    fontArray,
    fontFiles,
  };
}

(async () => {
  if (!clientName) throw new Error(`Client: Please enter a valid client name`);

  try {
    // connect to delivery-api to get response
    const resp = await axios.get(
      `${process.env.DELIVERY_API}?appId=${clientName}&platform=web`,
    );
    const { url } = resp.data.images;

    const { fontArray, fontFiles } = await getDownloadedAssets(url);

    const validFonts = fontFiles.filter(isValidFont);


    // -----------UPLOADING FONT ASSETS
    // download the text file where all uploaded font files are saved from S3

    let rootObject = ":root {\n";
    let fontPath = "";

    if (validFonts.length > 0) {
      for (let x = 0; x < validFonts.length; x += 1) {
        const fontFile = validFonts[x];
        const [fontName, fontExt] = fontFile.split(".");

        rootObject += `--font-${x + 1}: "${fontName}";\n`;
        fontPath += `@font-face {
          font-family: ${fontName};
          src: url("${s3FontURL}/${fontFile}")
            format("${selectFontType(fontExt.toLowerCase())}");
        }\n\n`;

        if (!fontArray.includes(fontFile)) {
          const fileContent = await fs.readFile(
            `/tmp/client/fonts/${fontFile}`,
          );
          // Setting up S3 upload parameters
          const params = {
            Bucket: "assets.lunchbox.io",
            Key: `shared/fonts/${fontFile}`, // File name you want to save as in S3
            Body: fileContent,
          };

          // Uploading files to the bucket
          const fontFileUpload = await S3.upload(params).promise();
          console.log(
            `Font File uploaded successfully. ${fontFileUpload.Location}`,
          );
          await fs.appendFileSync(
            storageFontPath,
            `${fontFile.toString()}\n`,
          );
        }
      }

      rootObject = `${rootObject}}\n\n`;
      rootObject += fontPath;
      // create a css font file and upload to S3
      await fs.writeFile(
        path.resolve(
          __dirname,
          `../clients/${clientName.toLowerCase()}/theme.scss`,
        ),
        rootObject,
      );

      const fontFileContent = await fs.readFile(storageFontPath);

      // Upload font update
      const fontParams = {
        Bucket: "assets.lunchbox.io",
        Key: `shared/fonts/fontDb.txt`, // File name you want to save as in S3
        Body: fontFileContent,
      };

      // Uploading files to the bucket
      const fontResp = await S3.upload(fontParams).promise();
      console.log(`Font db uploaded successfully. ${fontResp.Location}`);
    }

    // --------UPLOADING IMAGE ASSETS-------------

    // get all images downloaded from zip files
    const imageFiles = await fs.readdir(path.resolve(`/tmp/client/images`));

    if (imageFiles.length > 0) {
      const imageUploads = imageFiles.map(async (eachImage) => {
        const fileContent = await fs.readFile(
          `/tmp/client/images/${eachImage}`,
        );

        // Setting up S3 upload parameters
        const imageParams = {
          Bucket: "assets.lunchbox.io",
          Key: `${clientName}/images/${eachImage}`, // File name you want to save as in S3
          Body: fileContent,
        };

        // Upload those image assets not available to S3 bucket
        return S3.upload(imageParams)
          .promise()
          .then((imagesResp) => {
            console.log(`Images uploaded successfully. ${imagesResp.Location}`);
          });
      });
      await Promise.all(imageUploads);
    }

    // --------UPLOADING LOADER ASSETS-------------

    const loaderFiles = await fs.readdir(path.resolve(`/tmp/client/loader`));

    if (loaderFiles.length > 0) {
      const loaderUploads = loaderFiles.map(async (loaderFile) => {
        const fileContent = await fs.readFile(
          `/tmp/client/loader/${loaderFile}`,
        );

        const imageParams = {
          Bucket: "assets.lunchbox.io",
          Key: `${clientName}/images/Loader/${loaderFile}`, // File name you want to save as in S3
          Body: fileContent,
        };

        // Upload those image assets not available to S3 bucket
        return S3.upload(imageParams)
          .promise()
          .then((loaderResp) => {
            console.log(`Loader uploaded successfully. ${loaderResp.Location}`);
          });
      });
      await Promise.all(loaderUploads);
    }

    // In case of running on local computer run cleanup.
    // Not important for when running in containers
    await exec(`rm /tmp/client.zip`);
    await exec(`rm -R /tmp/client`);
    await exec(`rm ${storageFontPath}`);
  } catch (error) {
    console.log(error);
  }
})();
