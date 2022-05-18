const { validateThemeFile } = require("../src/moduleExports.js");
const { writeFile, unlink } = require("fs").promises;
const { logger, ensureDir, clients } = require("./utils");
const paths = require("./utils/paths");

const LOG_PATH = `./logs/themeValidation`;
const generateLogFilePath = (client) => `${LOG_PATH}/${client}_error.txt`;

(async () => {
  await ensureDir(LOG_PATH);

  for (const { name } of clients) {
    logger.info(`Validating ${name} Theme JSON...`);
    const logFilePath = generateLogFilePath(name);

    await unlink(logFilePath).catch((e) => null);
    try {
      const themeFilePath = paths.clientThemeJson(name);
      const themeJSON = require(themeFilePath);
      const validationError = await validateThemeFile(themeJSON);
      if (validationError) {
        await writeFile(logFilePath, `${themeFilePath}\n\n${validationError}`);
        logger.info(`${name} is invalid`);
      } else {
        logger.info(`${name} is valid`);
      }
    } catch (e) {
      logger.error(e);
    }
  }
})();
