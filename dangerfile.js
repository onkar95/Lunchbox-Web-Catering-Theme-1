/* eslint-disable import/no-extraneous-dependencies */
const { schedule, message, danger, warn, fail } = require("danger");
const noConsole = require("./scripts/danger-plugin-no-console");

schedule(
  noConsole({
    callback: (file, matches) => {
      if (!file.includes("src")) {
        // Files outside of src shouldn't trigger warnings
        return;
      }
      fail(`${matches.length} console statement(s) added in ${file}.`);
    },
    whitelist: ["error", "warn"],
  }),
);

const smallPRThreshold = 10;
const mediumPRThreshold = 400;
const bigPRThreshold = 600;

const lineChanges = danger.github.pr.additions + danger.github.pr.deletions;

const modifiedMD = danger.git.modified_files.join("- ");

message(`Changed Files in this PR: \n - ${modifiedMD}`);

if (lineChanges >= bigPRThreshold) {
  warn(
    ":exclamation: Big PR > Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.",
  );
}

if (lineChanges < bigPRThreshold && lineChanges >= mediumPRThreshold) {
  warn(
    ":warn: Medium PR > Pull Request size is getting pretty large. Try not to let this PR get larger",
  );
}

if (lineChanges < mediumPRThreshold && lineChanges >= smallPRThreshold) {
  message(
    ":smiley: > Pull Request size is an easy to review size. Props to you!",
  );
}

if (lineChanges <= smallPRThreshold) {
  message(":smiley: Tiny > Pull Request size is pretty tiny.");
}

// Require Jira ticket be in commit message
const { commits } = danger.github;
const jiraPattern = /^(ENG|PS|LB[EX])-\d+/;
if (!commits.some(({ commit }) => jiraPattern.test(commit.message))) {
  fail(
    "No Jira ticket in commit message. Please add the ticket ID (with prefix `ENG-`, `LBE-`, or `PS-`) to the beginning of at least one of your commit messages (you can use `git commit --amend` to update your most recent commit.)",
  );
}

const baseBranch = danger.github.pr.base.label.replace("lunchboxinc:", "");
const headBranch = danger.github.pr.head.label.replace("lunchboxinc:", "");

const hasChangelogChange = danger.git.modified_files.includes("CHANGELOG.md");

if (
  baseBranch === "develop" &&
  hasChangelogChange &&
  !headBranch.startsWith("release")
) {
  fail(
    "Do not update the changelog in feature branches. Instead, add changelog notes to the PR description.",
  );
}

if (baseBranch.includes("release") && hasChangelogChange) {
  fail(
    "Do not update the changelog in release fix branches. Release branch fixes should only contain bugfixes for the current release, which do not need to be mentioned in the changelog.",
  );
}

if (baseBranch === "master" && !hasChangelogChange) {
  fail("Please update the changelog before merging to `master`.");
}

const isValidBranchAgainstMaster = ["hotfix", "release", "client"].some(
  (branchPrefix) => headBranch.startsWith(branchPrefix),
);
if (baseBranch === "master" && !isValidBranchAgainstMaster) {
  fail(
    "Only hotfix, client, release branches can be merged to `master`. Make sure your branch is prefixed with `hotfix`, `client` or `release`.",
  );
}

/**
 * File Change Restrictions
 * We want to ensure engineers do not have the flexibility
 * to modify core files and configurations without the approval
 * of a leadership member.
 */

// Restricted files & directories
const restrictedFiles = [
  ".babelrc",
  ".circleci",
  ".editorconfig",
  ".eslintrc",
  ".github",
  ".gitignore",
  ".husky",
  ".huskyrc",
  ".lintstagedrc",
  ".prettierrc",
  "README.md",
  "cypress.json",
  "dangerfile.js",
  "jest.config.js",
  "package.json",
  "tsconfig.json",
  "tsconfig.spec.json",
];

// Github users that will be required to approve when changes to those files are made
const requiredApprovalGithubUsers = [
  "imsanchez",
  "aidanwang0309",
  "mafzal91",
  "stileslunch",
  "kodified",
  "KP-LBX",
  "ndurant-lunchbox",
  "leadhkr",
  "ronvlb",
];

const modifiedFiles = JSON.stringify(danger.git.modified_files);
const deletedFiles = JSON.stringify(danger.git.deleted_files);

// Look for restricted files
restrictedFiles.forEach((file) => {
  let willFail = true;

  // Restricted file was modified or deleted
  if (!modifiedFiles.includes(file) && !deletedFiles.includes(file)) {
    return;
  }

  // Check existing Github Reviews
  danger.github.reviews.forEach((review) => {
    if (
      requiredApprovalGithubUsers.includes(review.user.login) &&
      review.state === "APPROVED"
    ) {
      // Review user exists in required array and is approval
      willFail = false;
    }
  });

  if (willFail) {
    fail(
      `Changes to ${file} require an approval from an engineering lead or manager.`,
    );
  } else {
    warn(`Changes to ${file}, a restricted file, are present.`);
  }
});
