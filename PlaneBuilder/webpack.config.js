const path = require('path');

module.exports = {
    entry: './src/plane_builder.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'plane_builder_bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};