const express = require('express');
const fs = require('fs')
const path = require("path");
const server = express();
const resolve = file => path.resolve(__dirname, file);

const bundle = require("../dist/server/vue-ssr-server-bundle.json");
const {
    createBundleRenderer
} = require('vue-server-renderer')
const clientManifest = require(resolve('../dist/client/vue-ssr-client-manifest.json'))

const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: require('fs').readFileSync(resolve('../public/index.template.html'), 'utf-8'),
    clientManifest
})

function renderToString(context) {
    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
            if (err) {
                reject(err)
                return;
            }
            resolve(html)
        })
    })
}
// 中间件处理静态文件请求
server.use(express.static('../dist/client', {
    index: false
}))

server.get('*', async (req, res) => {
    try {
        const context = {
            url: req.url,
            title: 'ssr test'
        }
        const html = await renderToString(context);
        res.send(html)
    } catch (err) {
        console.log(err)
        res.status(500).send("服务器内部错误");
    }
})

server.listen(3000, () => {
    console.log("服务器启动成功")
});