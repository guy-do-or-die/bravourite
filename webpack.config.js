'use strict';

var webpack = require('webpack');
var path = require('path');

var srcPath = path.join(__dirname, 'web');
var babelLoader = 'babel-loader';


module.exports = {
    target: 'web',
    cache: true,
    devtool: 'source-map',
    entry: {'app': path.join(srcPath, 'app.js')},
    resolve: {
        extensions: ['*', '.js'],
        modules: ['node_modules', srcPath]
    },
    output: {
        path: path.join(__dirname, 'static/js/compiled'),
        publicPath: 'http://localhost:5000/js/compiled',
        library: ['App', '[name]'],
        filename: '[name].js'
    },
    module: {
        rules: [
            {test: /\.js?$/, include: srcPath, loaders: ['babel-loader']}
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true, compress: {warnings: false}, sourceMap: true
        }),
    ]
};
