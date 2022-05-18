/* eslint-disable */

/**
 * This module is copied and pasted from
 * https://raw.githubusercontent.com/withspectrum/danger-plugin-no-console/master/src/index.js
 *
 * That repo is no longer maintained, but had some useful changes that were never published
 * to npm.
 */

const PATTERN = /console\.(log|error|warn|info)/;
const GLOBAL_PATTERN = new RegExp(PATTERN.source, "g");
const JS_FILE = /\.(js|ts)x?$/i;

const findConsole = (content, whitelist) => {
  let matches = content.match(GLOBAL_PATTERN);
  if (!matches) return [];

  matches = matches.filter((match) => {
    const singleMatch = PATTERN.exec(match);
    if (!singleMatch || singleMatch.length === 0) return false;
    return !whitelist.includes(singleMatch[1]);
  });

  return matches;
};

const defaultCallback = (file, matches) =>
  fail(`${matches.length} console statement(s) added in ${file}.`);

/**
 * Danger plugin to prevent merging code that still has `console.log`s inside it.
 */
module.exports = async function noConsole(options = {}) {
  const whitelist = options.whitelist || [];
  const callback = options.callback || defaultCallback;
  if (!Array.isArray(whitelist))
    throw new Error(
      "[danger-plugin-no-console] whitelist option has to be an array.",
    );

  if (typeof callback !== "function")
    throw new Error(
      "[danger-plugin-no-console] callback option has to be an function.",
    );

  const diffs = danger.git.created_files
    .concat(danger.git.modified_files)
    .filter((file) => JS_FILE.test(file))
    .map((file) => {
      return danger.git.diffForFile(file).then((diff) => ({
        file,
        diff,
      }));
    });

  const additions = await Promise.all(diffs);

  additions
    .filter(({diff}) => !!diff)
    .forEach(({file, diff}) => {
      const matches = findConsole(diff.added, whitelist);
      if (matches.length === 0) return;

      callback(file, matches);
    });
};
