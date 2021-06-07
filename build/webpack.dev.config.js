const merge = require("webpack-merge");
const common = require("./webpack.base.config");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CopyWebpackPlugin([
      { from: "src/typings", to: "typings" },
      { from: "src/assets", to: "assets" },
    ]),
  ],
  devtool: "inline-source-map",
});
