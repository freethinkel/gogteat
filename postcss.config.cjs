const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const nested = require("postcss-nested");
const postcssImport = require("postcss-import");

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const config = {
  plugins: [
    nested(),
    autoprefixer(),
    postcssImport(),
    !dev &&
      cssnano({
        preset: "default",
      }),
  ],
};
module.exports = config;
