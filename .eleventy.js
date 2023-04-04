module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({"src/public":"/"})
  return {
    dir: {
      input: "src",
      output: "site",
    }
  }
}