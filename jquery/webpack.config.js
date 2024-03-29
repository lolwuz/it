const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Is the current build a development build
const IS_DEV = process.env.NODE_ENV === "dev";

const dirNode = "node_modules";
const dirApp = path.join(__dirname, "app");
const dirAssets = path.join(__dirname, "assets");

const appHtmlTitle = "Webpack Boilerplate";

/**
 * Webpack Configuration
 */
module.exports = {
    entry: {
        vendor: ["lodash"],
        bundle: path.join(dirApp, "index")
    },
    resolve: {
        modules: [dirNode, dirApp, dirAssets]
    },
    plugins: [
        new webpack.DefinePlugin({
            IS_DEV: IS_DEV
        }),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.ejs"),
            title: appHtmlTitle
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules)/,
                options: {
                    compact: true
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: IS_DEV
                        }
                    }
                ]
            },
            {
                test: /\.scss/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: IS_DEV
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: IS_DEV,
                            includePaths: [dirAssets]
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]"
                }
            }
        ]
    }
};
