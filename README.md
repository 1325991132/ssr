# ssr

## setup


```
yarn install
yarn serve
yarn build
```

## 搭建vue-ssr的demo

SSR全拼是Server-Side Rendering，服务端渲染，所谓服务端渲染，指的是把vue组件在服务器端渲染为组装好的HTML字符串，然后将它们直接发送到浏览器，最后需要将这些静态标记混合在客户端上完全可交互的应用程序。

### ssr解决的问题

1.满足seo需求，传统的spa数据都是异步加载的，爬虫引擎无法加载，需要利用ssr将数据直出渲染在页面源代码中。
2.更宽的内容达到时间（首屏加载更快），当请求页面的时候，服务端渲染完数据之后，把渲染好的页面直接发送给浏览器，并进行渲染。浏览器只需要解析html不需要去解析js。

### 按照官方文档配置过程中遇到的问题

1.Server-side bundle should have one single entry file. Avoid using CommonsChunkPlugin in the server config.

解决方法：在vue.config.js中下方的chainWebpack里添加==config.optimization.splitChunks(undefined)==，splitChunks如果在vue.config.js上方的configureWebpack添加的话会有此问题

```json
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
```

2.whitelist白名单报错，需要将vue.config.js中的 ==whitelist更改为allowlist==

```json
        externals: TARGET_NODE ? nodeExternals({
            // 不要外置化 webpack 需要处理的依赖模块。
            // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
            // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
            allowlist: /\.css$/
        }) : undefined,
```

