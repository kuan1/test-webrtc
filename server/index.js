const koa = require('koa')

const app = new koa()

app.use(require('koa-static')('public'))

const router = require("./router")

app
  .use(router.routes())
  .use(router.allowedMethods())

const port = 3000
app.listen(port)
console.log(`http://localhost:${port}`)