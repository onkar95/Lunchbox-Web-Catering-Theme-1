import _ from "lodash";
import {CLIENTS, ENVIRONMENTS, ALL} from "./constants.mjs";

export const ensureArray = (val) => (Array.isArray(val) ? val : [val]);
export const isArrayHaveAll = (subset, superset) => {
  return _.difference(subset, superset).length === 0;
};

export const validateEnvironments = (environments) => {
  const envs = ensureArray(environments);
  const isBuildAll = envs.includes(ALL);
  if (!isBuildAll) {
    if (!isArrayHaveAll(envs, ENVIRONMENTS)) {
      return false;
    }
  }

  return true;
};

export const validateClients = (clients) => {
  const clientsList = ensureArray(clients);
  const isBuildAll = clientsList.includes(ALL);
  if (!isBuildAll) {
    if (!isArrayHaveAll(clientsList, CLIENTS)) {
      return false;
    }
  }

  return true;
};

export const sanitizeEnvironments = (environments) => {
  const envs = ensureArray(environments);
  const isBuildAll = envs.includes(ALL);
  const validEnvironmentsOnly = _.intersection(envs, ENVIRONMENTS);
  return isBuildAll ? ENVIRONMENTS : validEnvironmentsOnly;
};

export const sanitizeClients = (clients) => {
  const clientsList = ensureArray(clients);
  const isBuildAll = clientsList.includes(ALL);
  const validClientsOnly = _.intersection(clientsList, CLIENTS);
  return isBuildAll ? CLIENTS : validClientsOnly;
};
