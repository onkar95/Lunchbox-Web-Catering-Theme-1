import clientsJson from "../clients.json" assert {type: "json"};

const {clients} = clientsJson;
export const ALL = "all";
export const CLIENTS = clients;

export const ENVIRONMENTS = [
  "development",
  "stage",
  "production",
  "qualityAssurance",
  "test",
];
