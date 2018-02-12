const webpack = require("webpack");
const path = require("path");
const HappyPack = require("happypack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  cache: true,
  entry: {
    bundle: [path.join(__dirname, "../src/app.tsx")]
  },
  output: {
    path: path.resolve(__dirname, "../dist/assets"),
    filename: "bundle.js",
    publicPath: "/assets/"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "happypack/loader?id=ts",
        include: path.join(__dirname, "../src")
      },
      {
        test: /\.jsx?$/,
        loader: "source-map-loader"
      },
      {
        test: /(\.styl$)|(\.css$)/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HappyPack({
      id: "ts",
      threads: 4,
      loaders: [
        {
          path: "ts-loader",
          query: {
            happyPackMode: true,
            configFile: path.join(__dirname, "../src/tsconfig.json"),
            visualStudioErrorFormat: true
          }
        }
      ]
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"dev"'
    })
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [
      ".webpack.js",
      ".web.js",
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".css",
      ".styl"
    ]
  }
};
