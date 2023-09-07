const Dotenv = require("dotenv-webpack");

module.exports = {
  plugins: [new Dotenv()],
  resolve: {
    fallback: {
      zlib: require.resolve("browserify-zlib"),
    },
  },
};
