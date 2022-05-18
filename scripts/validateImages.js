const {ImageSchema} = require("../src/moduleExports.js");
const {appendFile, writeFile, unlink} = require("fs").promises;
const axios = require("axios");
const {logger, ensureDir, clients} = require("./utils");
const paths = require("./utils/paths");

const LOG_PATH = `./logs/imageValidation`;
const generateLogFilePath = (client) => `${LOG_PATH}/${client}_error.txt`;

const alphabetizeObjectKeys = (unordered) => {
  let alphabetized = Object.keys(unordered)
    .sort()
    .reduce((ordered, key) => {
      if (typeof unordered[key] !== "string") {
        throw new Error("nested data structures not allowed!");
      }
      ordered[key] = unordered[key];
      return ordered;
    }, {});
  return alphabetized;
};

(async () => {
  await ensureDir(LOG_PATH);
  const imageKeyNames = new Set();

  for (const {name} of clients) {
    logger.info(`Validating ${name} Image JSON...`);
    const logFilePath = generateLogFilePath(name);
    await unlink(logFilePath).catch((e) => null);

    try {
      const imagesFilePath = paths.clientImageJson(name);
      let imagesJSON = require(imagesFilePath);

      // Alphabetized object keys and write to source file
      imagesJSON = alphabetizeObjectKeys(imagesJSON);
      await writeFile(imagesFilePath, JSON.stringify(imagesJSON, null, 2));

      // Checks if all keys are defined
      ImageSchema.validate(imagesJSON, { abortEarly: false }).then().catch(
       (error) => {
         error.inner.forEach(e=> {
            logger.error(e);
         })
       }
      );

      // Checks if all images are publically available.
      let hasError = false;
      const imageRequests = Object.entries(imagesJSON).map(([key, value]) => {
        imageKeyNames.add(key);
        return axios
          .get(value)
          .then((res) => [key, "Good"])
          .catch((e) => {
            hasError = true;
            return [key, value];
          });
      });

      let erroredImages = await Promise.all(imageRequests);
      erroredImages = Object.fromEntries(erroredImages);

      if (hasError) {
        await appendFile(logFilePath, JSON.stringify(erroredImages, null, 2));
        throw new Error(`${name} has invalid images`);
      } else {
        logger.info(`${name} is valid`);
      }
    } catch (e) {
      if (e) {
        await appendFile(logFilePath, JSON.stringify(e, null, 2));
      }

      logger.error(e);
    }
  }
  // Prints all available key names across all client image.json files
  console.table(Array.from(imageKeyNames.entries()));
})();
