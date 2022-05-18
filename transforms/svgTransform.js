module.exports = {
  getCacheKey() {
    // The output is always the same.
    return "svgTransform";
  },
  process() {
    return "module.exports = {};";
  },
};
