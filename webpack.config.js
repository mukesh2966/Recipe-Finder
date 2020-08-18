const path = require("path"); // include built-in node module the path

const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["@babel/polyfill", "./src/js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"), // need to be absolute path
    filename: "js/bundle.js",
  },
  devServer: {
    contentBase: "./dist",
  },
  // plugins helps in complex processing of input files
  plugins: [
    new htmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html", // source file
    }),
  ],
  // loaders in webpack helps in converting Saas file to css, ES6 to ES5
  module: {
    // array of loaders
    rules: [
      {
        test: /\.js$/, // regex for all files that ends in .js
        exclude: /node_modules/, // excludes these all files from babel loader
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
