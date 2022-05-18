// Logging Function
const chalk = require("chalk");

module.exports = {
  send: console.log,
  info: (msg, field = null) =>
    console.log(chalk.blue(msg) + (field ? `: ${chalk.cyan(field)}` : "")),
  success: (msg, field = null) =>
    console.log(chalk.green(msg) + (field ? `: ${chalk.cyan(field)}` : "")),
  warning: (msg, field = null) =>
    console.log(chalk.yellow(msg) + (field ? `: ${chalk.cyan(field)}` : "")),
  error: (msg, field = null) =>
    console.log(chalk.red(msg) + (field ? `: ${chalk.cyan(field)}` : "")),
  fatal: (err) => {
    let error = err;
    if (err?.isTtyError) {
      error = "Prompt couldn't be rendered in the current environment.";
    } else if (err?.message) {
      error = err.message;
    }
    console.log(chalk.red(error));
    process.exit(1);
  },
};
