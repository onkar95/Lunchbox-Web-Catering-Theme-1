/* eslint-disable no-restricted-syntax */
import {writeFile, unlink} from "fs/promises";
import _ from "lodash";
import paths from "./utils/paths.js";

import {DefaultLanguage} from "../src/moduleExports.js";
import clientsJson from "./clients.json";

import logger from "./utils/logger.js";
import {ensureDir} from "./utils/index.js";

const {clients} = clientsJson;
const LOG_PATH = `./logs/languageValidation`;
const generateLogFilePath = (client) => `${LOG_PATH}/${client}_error.txt`;

await ensureDir(LOG_PATH);

const getAllPaths = (obj, parentKey = "") => {
  let result;
  if (_.isArray(obj)) {
    let idx = 0;
    result = _.flatMap(obj, (subObj) => {
      idx += 1;
      return getAllPaths(subObj, `${parentKey}[${idx}]`);
    });
  } else if (_.isPlainObject(obj)) {
    result = _.flatMap(_.keys(obj), (key) => {
      return _.map(getAllPaths(obj[key], key), (subkey) => {
        return (parentKey ? `${parentKey}.` : "") + subkey;
      });
    });
  } else {
    result = [];
  }
  return _.concat(result, parentKey || []);
};

const getObjectLeafPaths = (obj) => {
  const allObjectPaths = getAllPaths(obj);
  return allObjectPaths.filter((path) => !_.isObject(_.get(obj, path)));
};

for (const client of clients) {
  const logFilePath = generateLogFilePath(client);

  await unlink(logFilePath).catch((e) => null);
  try {
    const themeFilePath = paths.clientLangJson(client);
    const {default: clientLanguageJSON} = await import(themeFilePath);

    const clientLeafPaths = getObjectLeafPaths(clientLanguageJSON);

    const unnecessaryClientLangPaths = clientLeafPaths
      .filter((leafPath) => {
        const defaultValueAtPath = _.get(DefaultLanguage, leafPath);
        const clientValueAtPath = _.get(clientLanguageJSON, leafPath);
        return defaultValueAtPath === clientValueAtPath;
      })
      .reduce((accu, path) => {
        const defaultValueAtPath = _.get(DefaultLanguage, path);
        const clientValueAtPath = _.get(clientLanguageJSON, path);
        accu.push({
          clientValue: clientValueAtPath,
          defaultValue: defaultValueAtPath,
          path,
        });
        return accu;
      }, []);

    if (unnecessaryClientLangPaths.length) {
      await writeFile(
        logFilePath,
        JSON.stringify(unnecessaryClientLangPaths, null, 2),
      );
      logger.error(`${client} has unnecessary en.json overrides`);
    } else {
      logger.info(`${client} <===== No unnecessary duplicates =====>`);
    }
  } catch (e) {
    logger.error(e);
  }
}
