const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const router = new Router()

const cache = require('./cache')

router.get('/api/cache/:id', (ctx) => {
  ctx.body = cache[ctx.params.id] || null
})

router.post('/api/cache/:id', bodyParser(), (ctx) => {
  const { id } = ctx.params
  if (!id) ctx.body = null
  ctx.body = cache[id] = ctx.request.body.data
})

module.exports = router
