/*eslint-env node */

const path = require("path")
const postcssPresetEnv = require("postcss-preset-env")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

// Shim for `src/versions.js`
const VERSIONS = `export default ${JSON.stringify({
    "vue-eslint-demo": {
        repo: "mysticatea/vue-eslint-demo",
        version: require("./package.json").version,
    },
    eslint: {
        repo: "eslint/eslint",
        version: require("eslint/package.json").version,
    },
    "eslint-plugin-emmanuel": {
        repo: "Manu1400/eslint-plugin-emmanuel",
        version: require("eslint-plugin-emmanuel/package.json").version,
    },
    "vue-eslint-parser": {
        repo: "mysticatea/vue-eslint-parser",
        version: require("vue-eslint-parser/package.json").version,
    },
    "babel-eslint": {
        repo: "babel/babel-eslint",
        version: require("babel-eslint/package.json").version,
    },
    "typescript-eslint-parser": {
        repo: "eslint/typescript-eslint-parser",
        version: require("typescript-eslint-parser/package.json").version,
    },
    typescript: {
        repo: "Microsoft/typescript",
        version: require("typescript/package.json").version,
    },
})}`

// Shim for vue-eslint-parser.
const IMPORT_PARSER = `(
    parserOptions.parser === "babel-eslint" ? require("babel-eslint") :
    parserOptions.parser === "typescript-eslint-parser" ? require("typescript-eslint-parser") :
    /* otherwise */ require("espree")
)`

module.exports = env => {
    const prod = Boolean(env && env.production)
    const mode = prod ? "production" : "development"
    const browserlist = [">1%", "not dead", "not ie 11"]

    return {
        // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
        node: {
            fs: "empty",
        },
        mode,
        target: "web",
        entry: "./src/index.js",
        output: {
            path: path.resolve(__dirname, "./dist"),
            filename: "index.js",
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: ["vue-loader"],
                },
                {
                    test: /\.m?js$/,
                    exclude: /node_modules[\\/](?!vue-eslint-editor)/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                babelrc: false,
                                cacheDirectory: true,
                                plugins: [
                                    "@babel/plugin-syntax-dynamic-import",
                                    [
                                        "@babel/plugin-transform-runtime",
                                        { useESModules: true },
                                    ],
                                ],
                                presets: [
                                    [
                                        "@babel/preset-env",
                                        {
                                            modules: false,
                                            targets: browserlist,
                                            useBuiltIns: "entry",
                                        },
                                    ],
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "vue-style-loader",
                            options: {},
                        },
                        {
                            loader: "css-loader",
                            options: {},
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: [
                                    postcssPresetEnv({
                                        browsers: browserlist,
                                        stage: 3,
                                    }),
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg|eot|ijmap|ttf|woff2?)$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 8192,
                            },
                        },
                    ],
                },
                // Replace `./src/versions.js` with the current versions.
                {
                    test: /src[\\/]versions/,
                    use: [
                        {
                            loader: "string-replace-loader",
                            options: {
                                search: "[\\s\\S]+", // whole file.
                                replace: VERSIONS,
                                flags: "g",
                            },
                        },
                    ],
                },
                // `vue-eslint-parser` has `require(parserOptions.parser || "espree")`.
                // Modify it by a static importing.
                {
                    test: /node_modules[/\\]vue-eslint-parser[/\\]index\.js$/,
                    use: [
                        {
                            loader: "string-replace-loader",
                            options: {
                                search:
                                    'typeof parserOptions.parser === "string"\n        ? require(parserOptions.parser)\n        : require("espree")',
                                replace: IMPORT_PARSER,
                            },
                        },
                    ],
                },
                // Patch for `babel-eslint` -- accessing `global` causes build error.
                {
                    test: /node_modules[/\\]babel-eslint[/\\]lib[/\\]analyze-scope\.js$/,
                    use: [
                        {
                            loader: "string-replace-loader",
                            options: {
                                search: 'require("./patch-eslint-scope")',
                                replace: "Object",
                            },
                        },
                    ],
                },
                // Patch for `eslint-utils` -- accessing `global` causes build error.
                {
                    test: /node_modules[/\\]eslint-utils[/\\]index\.m?js$/,
                    use: [
                        {
                            loader: "string-replace-loader",
                            options: {
                                search: "\\bin global\\b",
                                replace: "in window",
                                flags: "g",
                            },
                        },
                        {
                            loader: "string-replace-loader",
                            options: {
                                search: "\\bglobal\\[",
                                replace: "window[",
                                flags: "g",
                            },
                        },
                    ],
                },
                // Patch for `typescript`
                {
                    test: /node_modules[/\\]typescript[/\\]lib[/\\]typescript.js$/,
                    use: [
                        {
                            loader: "string-replace-loader",
                            options: {
                                search: "require\\(.+?\\)",
                                replace: "null",
                                flags: "g",
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            alias: {
                vue$: "vue/dist/vue.esm.js",
            },
            extensions: [".mjs", ".js", ".vue", ".json"],
        },
        plugins: [new VueLoaderPlugin()],
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            compress: true,
        },
        performance: {
            hints: false,
        },
        devtool: false,
    }
}
