const HtmlWebPackPlugin = require("html-webpack-plugin");


module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: __dirname + '/build'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: { chunks: "all" }
  },
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    historyApiFallback: true,
    proxy: {
      '/': 'http://localhost:5000'
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    })
  ]
};