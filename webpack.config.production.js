const path = require('path')
const webpack = require('webpack')

module.exports = {
    devtool: 'nosources-source-map',
    entry: './index.es',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.bundle.js',
    },
    module: {
        loaders: [{
            test: /\.es$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'stage-0'],
            }
        }],
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
    ],
    stats: {
        colors: true
    },
}
