import path from 'path';
import type webpack from 'webpack';
import type * as DevServer from 'webpack-dev-server';
import dotenv from 'dotenv';

import HtmlWebpackPlugin from 'html-webpack-plugin';

dotenv.config({
  debug: process.env.DOTENV_CONFIG_DEBUG === 'true',
  override: process.env.DOTENV_CONFIG_OVERRIDE === 'true',
  path: process.env.DOTENV_CONFIG_PATH ?? './.env.local'
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dotenv = require('dotenv-webpack');

const currentEnvironment = process.env.NODE_ENV as 'none' | 'development' | 'production';
const isProduction = currentEnvironment === 'production';
const isDebuggerEnabled = currentEnvironment !== 'production';
const loggerLevel = process.env.WEBPACK_LOGGER_LEVEL as 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose' | undefined;
const devServerOption: DevServer.Configuration = {
  setupExitSignals: true,
  server: isProduction ? 'https' : 'http',
  http2: isProduction,
  port: 3000,
  allowedHosts: 'all',
  client: {
    logging: loggerLevel,
    progress: !isProduction,
    overlay: {
      errors: isDebuggerEnabled,
      warnings: isDebuggerEnabled,
      runtimeErrors: isDebuggerEnabled
    }
  },
  compress: isProduction,
  static: [
    { directory: path.resolve(__dirname, 'dist') },
    {
      directory: path.resolve(__dirname, 'public'),
      serveIndex: true
    }
  ],
  headers: () => ({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Cross-Origin-Opener-Policy': 'same-origin'
  }),
  historyApiFallback: true
};

const config: webpack.Configuration = {
  mode: currentEnvironment,
  name: currentEnvironment,
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'eval-cheap-source-map',
  devServer: devServerOption,
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '.env.local')
    }),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: ''
    }),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          template: path.resolve(__dirname, 'public/index.html')
        },
        isProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            }
          : undefined
      ))
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: ['/node_modules/', '/public/'],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        exclude: ['/node_modules/', '/public/'],
        type: 'asset'
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  }
};

export default config;
