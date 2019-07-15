"use strict"

const { writeFileSync } = require("fs")

writeFileSync(
    "dist/versions.json",
    JSON.stringify({
        "babel-eslint": require("babel-eslint/package.json").version,
        eslint: require("eslint/package.json").version,
        "eslint-plugin-emmanuel": require("eslint-plugin-emmanuel/package.json").version,
        typescript: require("typescript/package.json").version,
        "typescript-eslint-parser": require("typescript-eslint-parser/package.json")
            .version,
        "vue-eslint-demo": require("../package.json").version,
        "vue-eslint-parser": require("vue-eslint-parser/package.json").version,
    }),
)
