const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                loader: "source-map-loader"
            },

        ],
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
    mode: 'development',
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 3000,
        open: false,
    },
};