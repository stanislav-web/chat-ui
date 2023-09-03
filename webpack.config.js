const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const Dotenv = require('dotenv-webpack');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    devtool: 'eval-cheap-source-map',
    devServer: {
        static: [
            { directory: path.resolve(__dirname, 'dist') },
            { directory: path.resolve(__dirname, 'public') },
        ],
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '.env.local'),
        }),
        new InterpolateHtmlPlugin({
            PUBLIC_URL: '',
            NODE_ENV: process.env.NODE_ENV
        }),
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    template:  path.resolve(__dirname, 'public/index.html'),
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
                            minifyURLs: true,
                        },
                    }
                    : undefined
            )),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: ['/node_modules/'],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
