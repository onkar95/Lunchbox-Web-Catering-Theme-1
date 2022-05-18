const client = process.env.CLIENT || "bareburger";

module.exports = {
  // path to where jest stores cached directory information
  cacheDirectory: "/tmp/cache",
  testPathIgnorePatterns: [
    "<rootDir>/scripts/test.js",
    "<rootDir>/node_modules/",
  ],
  // simulates global browser environment, regardles of what environment test runs in..
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // svg
    ".+\\.(svg|png|jpg)$": "identity-obj-proxy",
    // gives us a class name to use for potential class queries in tests.
    "\\.module\\.s?css$": "identity-obj-proxy",
    // mocks css modules to an empty object, allowing jest to run.
    "\\.s?css$": require.resolve("./test-configs/style-mock.js"),
    "^components(.*)$": "<rootDir>/src/components$1",
    "^utils(.*)$": "<rootDir>/src/utils$1",
    "^hooks(.*)$": "<rootDir>/src/hooks$1",
    "^pages(.*)$": "<rootDir>/src/pages$1",
    "^assets(.*)$": "<rootDir>/src/assets$1",
    PackageData: "<rootDir>/package.json",
    ThemeData: `<rootDir>/clients/${client}/theme.json`,
    CommonConfig: `<rootDir>/clients/${client}/config/common.json`,
    EnvironmentConfig: `<rootDir>/clients/${client}/config/development.json`,
    ImagesConfig: `<rootDir>/clients/${client}/config/images.json`,
    LanguageData: `<rootDir>/clients/${client}/lang/en.json`,
    GeoConfig: `<rootDir>/clients/${client}/config/geo.json`,
  },
  transform: {
    "^.+\\.svg$": require.resolve("./transforms/svgTransform.js"),
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  // implicitly imports jest-dom's expect plugin to each test.
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  coverageDirectory: "./coverage/",
  // detect untested paths in code. If coverage is below 80%, jest will fail. This will force engineers to write tests for their work. 
  // TODO Temp changing to 5% and will change to 80% in a seperate ticket
  coverageThreshold: {
    "global": {
      "branches": 5,
      "functions": 5,
      "lines": 5,
      "statements": 5
    }
  },
};
