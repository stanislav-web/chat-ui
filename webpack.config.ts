import path from 'path';
import type webpack from 'webpack';
import type * as DevServer from 'webpack-dev-server';
import dotenv from 'dotenv';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
// eslint-disable-next-line import/default
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import * as process from 'process';
dotenv.config({
  debug: process.env.DOTENV_CONFIG_DEBUG === 'true',
  override: true,
  path: process.env.DOTENV_CONFIG_PATH ?? './.env.local'
});

const currentEnvironment = process.env.NODE_ENV as 'none' | 'development' | 'production';
const isProduction = currentEnvironment === 'production';
const isDebuggerEnabled = currentEnvironment !== 'production';
const loggerLevel = process.env.WEBPACK_LOGGER_LEVEL as 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose' | undefined;
const envDir = path.join(__dirname, process.env.DOTENV_CONFIG_PATH ?? './.env.local');
const srcDir = path.join(__dirname, './src');
const publicTemplateDir = path.join(__dirname, './public');
const destinationDir = path.join(__dirname, './dist');
const metaTitle = String(process.env.WEBPACK_TAG_TITLE);
const metaDescription = String(process.env.WEBPACK_TAG_DESCRIPTION);
const metaAuthor = String(process.env.WEBPACK_TAG_AUTHOR);
const metaKeywords = String(process.env.WEBPACK_TAG_KEYWORDS);

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
    { directory: destinationDir },
    {
      directory: publicTemplateDir
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
  context: srcDir,
  entry: './index.tsx',
  optimization: {
    emitOnErrors: true,
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        extractComments: true
      })
    ]
  },
  performance: {
    maxAssetSize: 50550000,
    maxEntrypointSize: 50550000,
    hints: 'error',
    assetFilter: function(assetFilename) {
      return !assetFilename.endsWith('.png') && !assetFilename.endsWith('.gif');
    }
  },
  output: {
    clean: true,
    crossOriginLoading: 'anonymous',
    path: destinationDir,
    filename: !isProduction ? 'bundle.js' : '[name].[fullhash].js'
  },
  devtool: 'eval-cheap-source-map',
  devServer: devServerOption,
  plugins: [
    new Dotenv({
      path: envDir
    }),
    new CleanWebpackPlugin({
      verbose: !isProduction
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: publicTemplateDir + '/assets/noise.gif', to: destinationDir + '/assets/noise.gif'
          },
          {
            from: publicTemplateDir + '/manifest.json', to: destinationDir + '/manifest.json'
          },
          {
            from: publicTemplateDir + '/logo192.png', to: destinationDir + '/logo192.png'
          },
          {
            from: publicTemplateDir + '/logo512.png', to: destinationDir + '/logo512.png'
          }
        ]
      }
    ),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          cache: isProduction,
          hash: true,
          minify: 'auto',
          favicon: publicTemplateDir + '/favicon.ico',
          template: publicTemplateDir + '/index.html',
          templateParameters: {
            manifest: 'manifest.json'
          },
          title: metaTitle,
          meta: {
            viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
            description: { name: 'description', content: metaDescription },
            author: { name: 'author', content: metaAuthor },
            keywords: { name: 'keywords', content: metaKeywords }
          },
          showErrors: true
        },
        isProduction
          ? {
              minify: {
                html5: true,
                decodeEntities: true,
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
      )),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        include: srcDir,
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
        test: /\.css|.scss$/i,
        include: srcDir,
        use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', {
          loader: 'css-loader',
          options: { sourceMap: !isProduction }
        },
        {
          loader: 'postcss-loader',
          options: { sourceMap: !isProduction }
        }]
      }
    ]
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  }
};

export default config;
