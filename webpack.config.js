const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

const context = path.resolve(__dirname, "src");

const outputDirectory = "dist";
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  entry: ["babel-polyfill", "./src/client/index.js"],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(pdf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     "style-loader",
      //     {
      //       loader: "css-loader",
      //       options: {
      //         importLoaders: 1,
      //         modules: true,
      //         localIdentName: "[path]___[name]__[local]___[hash:base64:5]",
      //         context,
      //       },
      //     },
      //   ],
      // },
      // {
      //   include: path.resolve(__dirname, "./src"),
      //   loader: "babel-loader",
      //   query: {
      //     plugins: [
      //       "@babel/transform-react-jsx",
      //       [
      //         "react-css-modules",
      //         {
      //           context,
      //         },
      //       ],
      //     ],
      //   },
      //   test: /\.js$/,
      // },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg|jpeg)$/,
        loader: "url-loader?limit=100000",
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  devServer: {
    port: 3001,
    open: false,
    https: true,
    proxy: {
      "/api": "http://127.0.0.1:8081",
    },
    historyApiFallback: true,
    disableHostCheck: true,
  },
  devtool: "cheap-module-source-map",
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    // new CompressionPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
};
