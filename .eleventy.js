module.exports = (eleventyConfig) => {
  // Passthrough
  eleventyConfig.addPassthroughCopy({"src/public":"/"})
  
  // Server Options
  eleventyConfig.setServerOptions({
    watch: ['_site/**/*.css'],
  });
  return {
    dir: {
      input: "src",
      output: "_site",
    }
  }
}