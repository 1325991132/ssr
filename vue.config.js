// vue.config.js
// webpack服务端和客户端的插件，负责生成服务端和客户端的包
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const nodeExternals = require("webpack-node-externals");
const merge = require("lodash.merge");
// 环境变量，决定入口是客户端还是服务端
const TARGET_NODE = process.env.WEBPACK_TARGET === "node";
const target = TARGET_NODE ? "server" : "client";

module.exports = {
    css: {
        extract: false
    },
    outputDir: './dist/' + target,
    configureWebpack: () => ({
        // 将 entry 指向应用程序的 server / client 文件
        entry: `./src/entry-${target}.js`,
        // 对 bundle renderer 提供 source map 支持
        devtool: 'source-map',
        // 这允许webpack以node适用的方式处理动态导入(dynamic import)，
        // 并且还会在编译Vue组件时告知'vue-loader' 输送面向服务器代码(server-oriented code)
        target: TARGET_NODE ? "node" : "web",
        node: TARGET_NODE ? undefined : false,
        output: {
            // 告知server bundle 使用node风格导出模块
            libraryTarget: TARGET_NODE ? "commonjs2" : undefined
        },
        // 外置化应用程序依赖模块。可以使服务器构建速度更快，
        // 并生成较小的 bundle 文件。
        externals: TARGET_NODE ? nodeExternals({
            // 不要外置化 webpack 需要处理的依赖模块。
            // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
            // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
            allowlist: /\.css$/
        }) : undefined,
        plugins: [TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
    }),
    chainWebpack: config => {
        config.optimization.splitChunks(undefined)
        config.module
            .rule("vue")
            .use("vue-loader")
            .tap(options => {
                merge(options, {
                    optimizeSSR: false
                });
            });
    }
};