export const parseHash = (hash) => {
  const hashless = hash.replace("#", "");
  const splitAmpersand = hashless.split("&").filter((i) => i);
  let ampersandObject = {};

  if (splitAmpersand.length) {
    ampersandObject = splitAmpersand.reduce((accu, i) => {
      const splitQuery = i.split("=");
      if (!splitQuery.length) return accu;
      const [key, value] = splitQuery;
      return {...accu, [key]: value};
    }, ampersandObject);
  }
  return {
    hashless,
    query: ampersandObject,
  };
};

export const parseQuery = (hash) => {
  const hashless = hash.replace("?", "");
  const splitAmpersand = hashless.split("&").filter((i) => i);
  let ampersandObject = {};

  if (splitAmpersand.length) {
    ampersandObject = splitAmpersand.reduce((accu, i) => {
      const splitQuery = i.split("=");
      if (!splitQuery.length) return accu;
      const [key, value] = splitQuery;
      return {...accu, [key]: value};
    }, ampersandObject);
  }
  return {
    query: ampersandObject,
  };
};

export const parseURL = (url) => {
  const {
    hash,
    host,
    hostname,
    href,
    origin,
    password,
    pathname,
    port,
    protocol,
    search,
    searchParams,
    username,
  } = new URL(url);
  return {
    hash,
    host,
    hostname,
    href,
    origin,
    password,
    pathname,
    port,
    protocol,
    search,
    searchParams,
    username,
  };
};
