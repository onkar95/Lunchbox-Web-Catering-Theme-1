"use strict";

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

// const path = require('path');
const fs = require("fs-extra");
const webpack = require("webpack");
const bfj = require("bfj");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const {checkBrowsers} = require("react-dev-utils/browsersHelper");
const chalk = require("chalk");
const configFactory = require("./config/webpack.config");
const paths = require("./config/paths");

const {logger, checkClientFiles, dotenv} = require(paths.utils);

const isInteractive = process.stdout.isTTY;

// Process CLI arguments
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf("--stats") !== -1;

// We require that you explicitly set browsers
// and do not fall back to browserslist defaults.

module.exports.runProductionBuild = async (client, buildEnv) => {
  await checkClientFiles(client, buildEnv);
  const dotenvData = dotenv(client, buildEnv);

  const config = configFactory(client, buildEnv, dotenvData);

  const previousFileSizes = await checkBrowsers(paths.appPath, isInteractive);
  // Merge with the public folder
  copyPublicFolder();
  // Start the webpack build
  const {warnings} = await build(config, previousFileSizes);

  if (warnings.length) {
    logger.warning("Compiled with warnings.\n");
    logger.send(warnings.join("\n\n"));
    logger.send(
      `\nSearch for the ${chalk.underline(
        chalk.yellow("keywords"),
      )} to learn more about each warning.`,
    );
    logger.send(
      `To ignore, add ${chalk.cyan(
        "// eslint-disable-next-line",
      )} to the line before.\n`,
    );
  } else {
    logger.success("Compiled successfully.\n");
  }
  return true;
};

// Create the production build and print the deployment instructions.
/**
 * @param config
 * @param previousFileSizes
 */
function build(config, previousFileSizes) {
  logger.send("Compiling project...");

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({all: false, warnings: true, errors: true}),
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join("\n\n")));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== "string" ||
          process.env.CI.toLowerCase() !== "false") &&
        messages.warnings.length
      ) {
        logger.warning(
          "\nTreating warnings as errors because process.env.CI = true.\n" +
            "Most CI servers set it automatically.\n",
        );
        return reject(new Error(messages.warnings.join("\n\n")));
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      };
      if (writeStatsJson) {
        return bfj
          .write(`${paths.appBuild}/bundle-stats.json`, stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch((error) => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
  });
}

/**
 *
 */
function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => file !== paths.appHtmlTemplate,
  });
}
