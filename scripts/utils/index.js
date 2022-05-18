const { log } = console;
const chalk = require("chalk");
const fs = require("fs");
const paths = require("../config/paths");
const logger = require("./logger");
const { gitInfo } = require("./git");

const { mkdir, access } = fs.promises;

const throwError = (err) => {
  let error = err;
  if (err.isTtyError) {
    error = "Prompt couldn't be rendered in the current environment.";
  } else if (err && err.message) {
    error = err.message;
  }
  log(chalk.red(error));
  process.exit(1);
};

const getDirectories = (source) => {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

const clients = getDirectories(paths.clients)
  .reduce((accu, i) => [...accu, { name: i }], [])
  .filter(({ name }) => name !== "_defaults");

const ensureDir = async (path) => {
  await access(path).catch((e) => {
    logger.warning(`${path} is not accessible, creating...`);
  });
  await mkdir(path, { recursive: true });
};

const ensureSlash = (inputPath, needsSlash) => {
  const hasSlash = inputPath.endsWith("/");
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  }
  return inputPath;
};

const checkEnv = (env) => {
  const required = {
    BABEL_ENV: env.BABEL_ENV,
    BUILD_ENV: env.BUILD_ENV,
    CLIENT: env.CLIENT,
    LBX_API_URL: env.LBX_API_URL,
    LBX_API_VERSION: env.LBX_API_VERSION,
    NODE_ENV: env.NODE_ENV,
  };
  const check = Object.entries(required).reduce(
    (invalidKeys, [key, value]) =>
      !value || ["", null].includes(value)
        ? [...invalidKeys, key]
        : invalidKeys,
    [],
  );
  if (check && check.length) {
    throw new Error(
      `The ${check
        .join(", ")
        .replace(/, ([^,]*)$/, " and $1")} environment variable${
        check.length > 1 ? "s" : ""
      } are required but were not specified.`,
    );
  }
  return true;
};

const getClientEnvironment = () => {
  const raw = Object.keys(process.env).reduce(
    (env, key) => {
      env[key] = process.env[key];
      return env;
    },
    {
      // Useful for determining whether we’re running in production mode.
      // Most importantly, it switches React into the correct mode.
      NODE_ENV: process.env.NODE_ENV || "development",
    },
  );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
};

const readClientConfig = (client, environment) => {
  const commonConfig = require(paths.clientConfigJson(client, "common"));
  const environmentConfig = require(paths.clientConfigJson(
    client,
    environment,
  ));

  return {
    ...commonConfig,
    ...environmentConfig,
  };
};

const dotenv = (client, environment) => {
  const fs = require("fs");
  const path = require("path");
  const dotenv = require("dotenv");
  const dotenvExpand = require("dotenv-expand");

  const appDirectory = fs.realpathSync(process.cwd());

  if (fs.existsSync(paths.dotenvFile(environment))) {
    dotenvExpand(
      dotenv.config({
        path: paths.dotenvFile(environment),
      }),
    );
  }

  // Automatically assign the LBX API info so envs are not required
  switch (environment) {
    case "stage":
      process.env.LBX_API_URL = "https://patron.lunchbox.pub";
      break;
    case "production":
      process.env.LBX_API_URL = "https://patron.lunchbox.io";
      break;
    case "qualityAssurance":
      process.env.LBX_API_URL = "https://patron.lunchbox.wtf";
      break;
    case "local":
    case "development":
    case "test":
    default:
      process.env.LBX_API_URL = "https://patron.lunchbox.dev";
  }

  process.env.LBX_API_VERSION = "v0";
  process.env.CLIENT = client;
  process.env.BUILD_ENV = environment; // BABEL_ENV & NODE_ENV are restricted
  process.env.NODE_PATH = (process.env.NODE_PATH || "")
    .split(path.delimiter)
    .reduce((acc, folder) => {
      if (folder && !path.isAbsolute(folder)) {
        acc.push(path.resolve(appDirectory, folder));
      }
      return acc;
    }, [])
    .join(path.delimiter);

  const env = getClientEnvironment();
  return env && env.raw ? env : false;
};

// Warn and crash if required files are missing
const checkClientFiles = (client, environment) =>
  new Promise(async (resolve, reject) => {
    const themeJson = require(paths.clientThemeJson(client));
    const checkRequiredFiles = require("react-dev-utils/checkRequiredFiles");
    const {
      ConfigSchema,
      ImageSchema,
      validateThemeFile,
    } = require("../../src/moduleExports.js");
    const clientConfig = readClientConfig(client, environment);
    const imagesJSON = require(paths.clientImageJson(client));
    logger.info(`\nProceed with ${client} (${environment})...\n`);
    logger.info(`Checking required files...`);

    if (
      !checkRequiredFiles([
        paths.appHtmlTemplate,
        paths.appIndexJs,
        paths.packageJson,
        paths.clientSass(client),
        paths.clientThemeSass(client),
        paths.clientThemeJson(client),
        paths.clientImageJson(client),
        paths.clientConfigJson(client, "common"),
        paths.clientConfigJson(client, environment),
        paths.clientLangJson(client),
      ])
    ) {
      reject(`Required files missing!\n`);
    }

    logger.success("Required files found!\n");

    logger.info("Validating configuration schema...");
    // This will throw an error if invalid
    ConfigSchema.validateSync(clientConfig);
    logger.success("Configuration schema correct!\n");
    resolve(true);

    logger.info("Validating theme file...");
    const error = await validateThemeFile(themeJson);
    if (error) {
      logger.fatal(error);
      throw error;
    }
    logger.success("Theme file is valid!\n");

    logger.info("Validating images file...");
    ImageSchema.validateSync(imagesJSON);
    logger.success("Images schema correct!\n");
  });

module.exports = {
  checkClientFiles,
  checkEnv,
  clients,
  dotenv,
  ensureDir,
  ensureSlash,
  getClientEnvironment,
  gitInfo,
  logger,
  readClientConfig,
  throwError,
};
