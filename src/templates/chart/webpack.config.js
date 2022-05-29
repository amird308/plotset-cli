const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: {
    main: './src/js/index.js',
    styles: './src/css/main.css',
  },
  stats: { children: true },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: '[name].[contenthash].js',
  },
  optimization: {
    minimize: true,
    // removeEmptyChunks: false,
    minimizer: [
        new TerserPlugin({
            terserOptions: {
                keep_classnames: true,
                keep_fnames: true,
            }
          })
        ]
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins:[
              [require.resolve("@babel/plugin-transform-runtime"),
              {
                "regenerator": true,
                corejs: false,
                useESModules: true,
                helpers: false,
              }
            ],
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      { test: /\.pug$/, loader: 'pug-loader' },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/bindings.json', to: 'bindings.json' },
        { from: 'src/data.csv', to: 'data.csv' },
        { from: 'src/info.json', to: 'info.json' },
        { from: 'src/settings.json', to: 'settings.json' },
        { from: 'src/thumbnail.png', to: 'thumbnail.png' },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: true,
      cache: false,
      template: 'template.pug',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
  ],
}
