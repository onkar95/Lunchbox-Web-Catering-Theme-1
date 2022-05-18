// Set options as a parameter, environment variable, or rc file.
// eslint-disable-next-line no-global-assign
require = require("esm")(module /* , options */);
const {ConfigSchema} = require("./utils/Schemas/configSchema.js");
const {ImageSchema} = require("./utils/Schemas/imageSchema.js");
const {validateThemeFile} = require("./Theme/validators");
const DefaultLanguage = require("./utils/Copy/combinedCopy");

module.exports = {
  ConfigSchema,
  DefaultLanguage,
  ImageSchema,
  validateThemeFile,
};
