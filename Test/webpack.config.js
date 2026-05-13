const path = require('path');

module.exports = {
    entry: {
        plane_builder: './src/plane_builder.ts',
        hangar: './src/Hangar/hangar.ts',
        engine_builder_app: './src/wasm/builders/engine_builder_app.ts',
        helicopter_builder: '../Helicopter/src/helicopter_builder.ts',
        helicopter_hangar: '../Helicopter/src/Hangar/helicopter_hangar.ts',
    },
    experiments: {
        asyncWebAssembly: true,
        outputModule: true,
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
    optimization: {
        splitChunks: {
            cacheGroups: {
                wasmPkg: {
                    test: /[\\/]pkg[\\/]/,
                    name: 'pkg_flyingcircuswasm',
                    chunks: 'all',
                    enforce: true,
                    priority: 10,
                },
            },
        },
    },
    output: {
        // filename: '[name].js',
        filename: (pathData) => {
            switch (pathData.chunk.name) {
                case "plane_builder":
                    return "[name].js";
                case "hangar":
                    return "Hangar/[name].js";
                case "engine_builder_app":
                    return "EngineBuilder/[name].js";
                case "helicopter_builder":
                    return "../Helicopter/[name].js";
                case "helicopter_hangar":
                    return "../Helicopter/Hangar/[name].js";
                case "pkg_flyingcircuswasm":
                    return "pkg_flyingcircuswasm.js";
                default:
                    return "[name].js";
            }
        },
        path: path.resolve(__dirname, '.'),
        webassemblyModuleFilename: 'flyingcircus.module.wasm',
        publicPath: 'auto',
    },
};