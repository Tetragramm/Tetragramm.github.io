const path = require('path');

module.exports = {
    entry: {
        helicopter_builder: './src/helicopter_builder.ts',
    },
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
        // filename: '[name].js',
        filename: (pathData) => {
            switch (pathData.chunk.name) {
                case "helicopter_builder":
                    return "[name].js";
                default:
                    return "[name]/[name].js";
            }
        },
        path: path.resolve(__dirname, '.'),
    },
};