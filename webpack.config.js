var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        vendor: './src/vendor',
        app: "./src/main",
        polyfills: './src/polyfills'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "http://localhost:8888/",
        filename: "js/[name].js"
    },
    module: {
        loaders: [{
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[ext]'
            },
            {
                test: /\.html$/,
                loader: 'html'
            },

            {
                test: /\.css$/,
                exclude: path.resolve(__dirname, "src", "app"),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, "src", "app"),
                loader: "raw-loader"
            }
        ]
    },
    resolve: {
        extensions: ['', '.ts', '.tsx', '.js', '.jsx']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),
        new ExtractTextPlugin("css/styles.css"),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};