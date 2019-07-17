const Koa = require('koa')
const koaBody = require('koa-body')
const session = require('koa-session')
const logger = require('koa-logger')
const Redis = require('redis')
const bluebird = require('bluebird');
const router = require('./routes')
const modelMiddleware = require('./middleware/model')
const authMiddleware = require('./middleware/auth')
const app = new Koa()

bluebird.promisifyAll(Redis.RedisClient.prototype)
bluebird.promisifyAll(Redis.Multi.prototype)
const redis = Redis.createClient()


app.keys = ['sinight']

const CONFIG = {
    key: 'rss-sinight', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  };

//redis客户端
app.use(async (ctx,next)=>{
    ctx.redis = redis;
    await next()
})

//跨域
app.use(async (ctx,next)=>{
    ctx.response.set('Access-Control-Allow-Origin','http://localhost:8080');
    ctx.response.set('Access-Control-Allow-Headers', 'Content-Type')
    ctx.response.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    ctx.response.set("Access-Control-Allow-Credentials", true)
    await next()
})
app.use(logger())
app.use(session(CONFIG,app))
app.use(koaBody())
app.use(modelMiddleware)
app.use(authMiddleware)
app.use(router.routes()).use(router.allowedMethods())


app.listen(5000)
console.log('http://localhost:5000')
