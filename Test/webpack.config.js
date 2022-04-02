const path = require('path');

module.exports = {
    entry: {
        plane_builder: './src/plane_builder.ts',
        weapon_display: './src/WeaponDisplay/weapon_display.ts',
        hangar: './src/Hangar/hangar.ts',
        engine_builder: './src/EngineBuilder/engine_builder.ts'
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
                case "plane_builder":
                    return "[name].js";
                case "weapon_display":
                    return "WeaponDisplay/[name].js";
                case "hangar":
                    return "Hangar/[name].js";
                case "engine_builder":
                    return "EngineBuilder/[name].js";
                default:
                    return "[name]/[name].js";
            }
        },
        path: path.resolve(__dirname, '.'),
    },
};