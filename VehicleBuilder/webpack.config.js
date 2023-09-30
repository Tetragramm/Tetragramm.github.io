const path = require('path');

module.exports = {
    entry: {
        vehicle_builder: './src/vehicle_builder.ts',
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
                case "vehicle_builder":
                    return "[name].js";
                default:
                    return "[name]/[name].js";
            }
        },
        path: path.resolve(__dirname, '.'),
    },
};