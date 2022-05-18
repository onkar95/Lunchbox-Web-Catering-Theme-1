const { ConfigSchema } = require("../src/moduleExports.js");
const { appendFile, unlink } = require("fs").promises;
const { logger, getDirectories, ensureDir, clients } = require("./utils");
const paths = require("./utils/paths");

const LOG_PATH = "logs/configValidation";
const generateLogFilePath = (client) => `${LOG_PATH}/${client}_error.txt`;

(async () => {
  await ensureDir(LOG_PATH);

  for (const { name } of clients) {
    logger.info(`Validating ${name} Config JSON...`);
    const logFilePath = generateLogFilePath(name);
    await unlink(logFilePath).catch((e) => null);

    try {
      const configFilePath = paths.clientConfigJson(name, "common");
      const commonJSON = require(configFilePath);
      const validationError = await ConfigSchema.validate(commonJSON);

      if (validationError) {
        await appendFile(logFilePath, validationError);
        throw validationError;
      }
      logger.info(`${name} is valid`);
    } catch (e) {
      logger.error(e);
    }
  }
})();
