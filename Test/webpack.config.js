const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

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
        // Drop debug logging (console.log/debug) from production bundles while
        // keeping console.warn/error. Source keeps the calls for dev builds.
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        pure_funcs: ['console.log', 'console.debug'],
                    },
                },
            }),
        ],
        splitChunks: {
            // Split code shared across entry points (plane/helicopter builders,
            // the two hangars) into their own chunks so the common app code is
            // downloaded once and cached across pages instead of duplicated into
            // every entry bundle. Webpack creates a separate chunk per group of
            // entries that share modules, so the hangar pages don't pull in the
            // builder code and vice-versa.
            chunks: 'all',
            cacheGroups: {
                wasmPkg: {
                    test: /[\\/]pkg[\\/]/,
                    name: 'pkg_flyingcircuswasm',
                    chunks: 'all',
                    enforce: true,
                    priority: 10,
                },
                shared: {
                    test: /[\\/]src[\\/]|[\\/]node_modules[\\/]/,
                    minChunks: 2,
                    priority: 5,
                    reuseExistingChunk: true,
                    // Name each shared chunk after the entry points that use it
                    // (e.g. "helicopter_builder+plane_builder") so the emitted
                    // files are self-documenting instead of opaque ids like 230.js.
                    name(_module, chunks) {
                        return chunks
                            .map((c) => c.name)
                            .filter(Boolean)
                            .sort()
                            .join('+');
                    },
                },
            },
        },
    },
    output: {
        // All bundles emit under Test/ (output.path). The Helicopter pages load
        // their bundles from ../Test/ via <script src>. Emitting helicopter
        // entries outside output.path (e.g. ../Helicopter/) breaks webpack's
        // relative import paths to shared chunks, so keep everything co-located.
        filename: (pathData) => {
            switch (pathData.chunk.name) {
                case "plane_builder":
                    return "[name].js";
                case "hangar":
                    return "Hangar/[name].js";
                case "engine_builder_app":
                    return "EngineBuilder/[name].js";
                case "helicopter_builder":
                    return "[name].js";
                case "helicopter_hangar":
                    return "Hangar/[name].js";
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