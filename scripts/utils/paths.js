"use strict";

const path = require("path");
const fs = require("fs");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

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
  if (["qualityAssurance", "test"].includes(env)) {
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
  clientDefaultImageJson: () =>
    resolveApp(`clients/_defaults/config/images.json`),

  clientTempThemeJson: resolveApp(`tmp/theme.json`),
  clientTempLangJson: resolveApp(`tmp/clientTempLang.json`),
  clientTempImagesJson: resolveApp(`tmp/clientTempImages.json`),
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
  clientsList: resolveApp("CLIENTS.md"),
  clientsJson: resolveApp("scripts/clients.json"),
  // TODO: Convert to log with names instead...
  versionsJson: resolveApp("scripts/versions.json"),
  clientsLog: resolveApp("logs/client.log"),
  utils: resolveApp("scripts/utils"),
  packageJson: resolveApp("package.json"),
  localScript: resolveApp("scripts/local.js"),
  buildScript: resolveApp("scripts/build.js"),
  testScript: resolveApp("scripts/test.js"),
  beforeWebpackBuildPlugin: resolveApp(
    "scripts/plugins/before-webpack-build.js",
  ),

  // misc
  tsConfig: resolveApp("tsconfig.json"),
  yarnLockFile: resolveApp("yarn.lock"),
  proxySetup: resolveApp("src/setupProxy.js"),
  moduleExports: resolveApp("src/moduleExports.js"),
  testsSetup: resolveModule(resolveApp, "src/setupTests"),
  themeLoader: resolveApp("scripts/loaders/templateParsers/index.js"),
  buildThemeSASS: resolveApp("src/styles/theme.module.scss"),
  moduleFileExtensions,
  ...clientPaths,
};
