module.exports = (eleventyConfig) => {
  // Passthrough
  eleventyConfig.addPassthroughCopy({"src/public":"/"})
  
  // Server Options
  eleventyConfig.setServerOptions({
    watch: ['_site/**/*.css'],
  });

  // Filters
  eleventyConfig.addFilter("pretty_json",(j)=>(JSON.stringify(j,null,2)))

  // Collections
  eleventyConfig.addCollection("pages", function(collectionApi) {
    // get all pages
    return collectionApi.getAll().map(({data:{permalink,title,navIndex,link_title}})=>{
      return {permalink,title,navIndex,link_title}
    }).sort((a,b) => (a.navIndex > b.navIndex) ? 1 : ((b.navIndex > a.navIndex) ? -1 : 0))
  });
  return {
    dir: {
      input: "src",
      output: "_site",
    }
  }
}