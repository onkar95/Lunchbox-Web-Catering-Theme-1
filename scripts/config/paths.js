"use strict";

const path = require("path");
const fs = require("fs");
const url = require("url");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

/**
 * @param inputPath
 * @param needsSlash
 */
function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith("/");
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  }
  return inputPath;
}

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

const mapEnv = (env) => {
  if (env === "qualityAssurance") {
    return "development";
  }
  return env;
};

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const clientPaths = {
  clients: resolveApp("clients"),
  clientDefaults: (path) => resolveApp(`clients/_defaults/${path}`),
  clientPath: (client) => resolveApp(`clients/${client}`),
  clientSass: (client) => resolveApp(`clients/${client}/client.scss`),
  clientThemeSass: (client) => resolveApp(`clients/${client}/theme.scss`),
  clientThemeJson: (client) => resolveApp(`clients/${client}/theme.json`),
  clientConfig: (client) => resolveApp(`clients/${client}/config`),
  clientConfigJson: (client, env = "common") => {
    return resolveApp(`clients/${client}/config/${mapEnv(env)}.json`);
  },
  clientImageJson: (client) =>
    resolveApp(`clients/${client}/config/images.json`),
  clientLang: (client) => resolveApp(`clients/${client}/lang`),
  clientLangJson: (client) => resolveApp(`clients/${client}/lang/en.json`),
};

// config after eject: we're in ./config/
module.exports = {
  // dotenv
  dotenv: resolveApp(".env"),
  dotenvFile: (env) => resolveApp(`.env.${env}`),

  // app
  appPath: resolveApp("."),
  appSrc: resolveApp("src"),
  appBuild: resolveApp("dist"),
  appPublic: resolveApp("public"),
  appNodeModules: resolveApp("node_modules"),
  appHtmlTemplate: resolveApp("public/index.ejs"),
  appIndexJs: resolveModule(resolveApp, "src/index"),

  // build script
  utils: resolveApp("scripts/utils"),
  packageJson: resolveApp("package.json"),
  localScript: resolveApp("scripts/local.js"),
  buildScript: resolveApp("scripts/build.js"),
  testScript: resolveApp("scripts/test.js"),

  // misc
  tsConfig: resolveApp("tsconfig.json"),
  yarnLockFile: resolveApp("yarn.lock"),
  proxySetup: resolveApp("src/setupProxy.js"),
  moduleExports: resolveApp("src/moduleExports.js"),
  testsSetup: resolveModule(resolveApp, "src/setupTests"),

  moduleFileExtensions,
  ...clientPaths,
};

module.exports.moduleFileExtensions = moduleFileExtensions;
