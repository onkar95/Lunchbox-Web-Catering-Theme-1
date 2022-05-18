import { writeFileSync } from "fs";
import yaml from "js-yaml";
import {
  validateEnvironments,
  validateClients,
  sanitizeEnvironments,
  sanitizeClients,
} from "./validators.mjs";

const FILE_DIR = `/tmp`;
const FILE_NAME = `generated_config.yml`;
const FILE_PATH = `${FILE_DIR}/${FILE_NAME}`;

const defaultArgv = {
  clients: [],
  environments: [],
  nolint: "",
  useBackendConfigs: "",
};

const parseArgv = (args) => {
  try {
    let parsedClients = (args?.[0] ?? "").split(",");
    let parsedEnvironments = (args?.[1] ?? "").split(",");
    const parsedNolint = args?.[2] ?? "";
    const parsedUseBackendConfigs = args?.[3] ?? "";

    parsedEnvironments = sanitizeEnvironments(parsedEnvironments);
    parsedClients = sanitizeClients(parsedClients);

    return {
      clients: parsedClients,
      environments: parsedEnvironments,
      nolint: parsedNolint,
      useBackendConfigs: parsedUseBackendConfigs,
    };
  } catch (err) {
    console.error(err);
    return defaultArgv;
  }
};

const argv = parseArgv(process.argv.slice(2));

const buildEnvs = argv.environments.map((env) => {
  return {
    [`build-client`]: {
      name: `build-client-${env}-<< matrix.client >>`,
      requires: ["install-deps"],
      context: ["web-ordering"],
      nolint: argv.nolint,
      environment: env,
      matrix: {
        parameters: {
          client: argv.clients,
        },
      },
    },
  };
});

/* eslint-disable sort-keys */
const globalCommands = {
  commands: {
    bootstrap: {
      description: "Install dependencies",
      parameters: { key: { type: "string", default: "node" } },
      steps: [
        "checkout",
        {
          run: "npm config set scope=@lunchboxinc registry=https://registry.npmjs.org/",
        },
        {
          run: {
            name: "Authenticate with registry",
            command:
              'echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > ~/.npmrc',
          },
        },
        { run: "node --version" },
        {
          restore_cache: {
            key: 'dependency-cache-{{ arch }}-<< parameters.key >>-{{ .Environment.DEPENDENCY_CACHE }}-{{ checksum "package-lock.json" }}',
          },
        },
        { run: "npm ci" },
        {
          save_cache: {
            key: 'dependency-cache-{{ arch }}-<< parameters.key >>-{{ .Environment.DEPENDENCY_CACHE }}-{{ checksum "package-lock.json" }}',
            paths: ["./node_modules"],
          },
        },
      ],
    },
  },
};

const installDeps = {
  "install-deps": {
    executor: { name: "node/default", tag: "16.14.2" },
    steps: [
      {
        bootstrap: { key: "node" },
      },
      {
        persist_to_workspace: {
          root: "node_modules",
          paths: ["*"],
        },
      },
    ],
  },
};

const buildClients = {
  "build-client": {
    parameters: {
      environment: { type: "string", default: "development" },
      client: { type: "string", default: "munchbox" },
      nolint: { type: "string", default: "" },
    },
    executor: "aws-cli/default",
    resource_class: "medium+",
    steps: [
      "checkout",
      { attach_workspace: { at: "node_modules" } },
      { run: "ls -al && mkdir tmp" },
      "aws-cli/setup",
      {
        run: {
          name: "Building << parameters.client >> << parameters.environment >> << parameters.nolint >>",
          command:
            "export NODE_OPTIONS=--max_old_space_size=5120\nexport CI=false \nnpm run build << parameters.client >> << parameters.environment >> << parameters.nolint >>",
        },
      },
    ],
  },
};

const workflow1 = {
  jobs: [{ "install-deps": { context: ["web-ordering"] } }, ...buildEnvs],
};

const baseConfig = {
  version: 2.1,
  orbs: {
    node: "circleci/node@4.2.0",
    "aws-cli": "circleci/aws-cli@1.4.0",
  },

  ...globalCommands,

  parameters: {
    clients: {
      type: "string",
      default: "",
    },
    environments: {
      type: "string",
      default: "",
    },
    nolint: {
      type: "string",
      default: "",
    },
    deployOnly: { type: "boolean", default: false },
    useBackendConfigs: { type: "boolean", default: false },
  },

  jobs: {
    ...installDeps,
    ...buildClients,
  },
  workflows: {
    build: workflow1,
  },
};
console.log(JSON.stringify(workflow1, null, 2));
const yamlStr = yaml.dump(baseConfig);

await writeFileSync(`${FILE_PATH}`, yamlStr);
