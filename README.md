# rss-web
> 一个简洁的web版的rss阅读器，vue+vue-router+koa2+sqlite+redis

功能实现:
- 用户登录注册
- 分类管理
- rss管理
- 文章进行了redis 1小时缓存，不过可以通过右下角的刷新按钮进行手动刷新，刷新进行了频率限制(两次刷新至少间隔10分钟)
- 后端接口采用cors实现跨域

### 如何运行:
client:
  - cd client
  - npm install
  - npm run serve //运行客户端，有3个报错没有影响，是eslint不允许console，不会影响执行
  - client目前有两个路由 /login和/home 所以只有这两个有页面显示
  
  
server:
  - cd server
  - npm install 
  - npm run db_init //初始化数据库和表
  - 开启自己的redis服务(app.js中是默认的127.0.0.1/6379,你可以自行去更改(`const redis = Redis.createClient()`))
  - node app.js //运行服务端
  - server端的cors限制了域名请求为localhost，有独特的需求可以自行更改，在app.js中(`ctx.response.set('Access-Control-Allow-Origin','http://localhost:8080');`)




![](https://test.demo-1s.com/images/2019/07/17/8YqCgNgRswheoaPG.png)

![](https://test.demo-1s.com/images/2019/07/17/OqqNPh6t0R25jFJg.png)
