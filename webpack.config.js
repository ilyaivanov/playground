const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  return {
    entry: "./src/app.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "app.[chunkhash].js",
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "index.html",
      }),
    //   // new MiniCssExtractPlugin({
    //   //   filename: "styles.[chunkhash].css",
    //   // }),
      isProd ? new CleanWebpackPlugin() : undefined,
    ].filter((x) => x),
  };
};