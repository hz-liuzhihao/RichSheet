const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "../lib"),
    libraryTarget: "commonjs2",
  },
  externals: {
    lodash: {
      commonjs: "lodash", //如果我们的库运行在Node.js环境中，import _ from 'lodash'等价于const _ = require('lodash')
      commonjs2: "lodash", //同上
      amd: "lodash", //如果我们的库使用require.js等加载,等价于 define(["lodash"], factory);
      root: "_",
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|mp4)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 20,
          },
        },
      },
    ],
  },
};
