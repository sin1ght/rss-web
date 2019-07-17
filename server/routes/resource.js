const Router = require('koa-router')
const _ = require('lodash')
const {success,error,rssParser,md5,getRssArticleList} = require('../utils')
const router=new Router({
    prefix:'/resource'
});


/**
 * 获取所有rss链接
 */
router.get('/',async (ctx,next)=>{
    let resources = await ctx.model.resource.findAll({
        where:{
            userId:ctx.session.user.id
        },
        order: [['createdAt', 'DESC']]
    })
    ctx.body=success(resources)
})


/**
 * 添加rss链接
 */
router.post('/add',async (ctx,next)=>{
    let { url,categoryId } = ctx.request.body
    let feed =null
    try {
       feed = await rssParser(url)
       ctx.body= success(feed)
    } catch(e) {
        console.log(e)
        ctx.body=error('rss链接解析错误，请输入合法url')
        return
    }

    //查询是否有重复url
    let resource = await ctx.model.resource.findOne({
        where:{
            url
        }
    })

    if(_.isNil(resource)){
        resource = await ctx.model.resource.create({
            name:feed.title,
            url
        })
        await Promise.all([resource.setCategory(categoryId),resource.setUser(ctx.session.user.id)])

        //判断redis中是否已经存在此rss的文章
        const articleList = await getRssArticleList(ctx,resource.url,resource.id)
       
        ctx.body=success({
            resource,
            articleList
        })
    }else{
        ctx.body=error('此rss资源已经添加过了')
    }
})


/**
 * 删除rss链接
 */
router.get('/delete',async (ctx,next)=>{
    const { rssId } = ctx.request.query

    try{
        await ctx.model.resource.destroy({
            where:{
                id:rssId
            }
        })
        ctx.body = success('删除成功')
    } catch {
        ctx.body = error('发生错误')
    }
})

/**
 * 根据rss 获取文章
 */
router.get('/article',async (ctx,next)=>{
    const { rssId } = ctx.request.query
    const resource = await ctx.model.resource.findOne({
        where:{
            userId:ctx.session.user.id,
            id:rssId
        }
    })

    if(!resource){
        ctx.body=error('非法rss')
    }else{
        const articleList = await getRssArticleList(ctx,resource.url,resource.id)
        ctx.body=success(articleList)
    }
})


/**
 * 再次拉取rss  刷新 查看是否有新的文章
 */
router.get('/article/refresh',async (ctx,next)=>{
    const { rssId } = ctx.request.query
    const resource = await ctx.model.resource.findOne({
        where:{
            userId:ctx.session.user.id,
            id:rssId
        }
    })

    if(!resource){
        ctx.body=error('非法rss')
    }else{
        const key = md5(resource.url)
        const feed = await rssParser(resource.url)
        feed.items.forEach(ele => {
            let article = {
                rssId:resource.id,
                title:ele.title,
                link:ele.link,
                pubDate:ele.pubDate,
                author:ele.author ? ele.author : ele['dc:creator'],
                categories:ele.categories?ele.categories:[]
            }
            ctx.redis.zadd(key,(new Date(article.pubDate)).getTime(),JSON.stringify(article))
        });
        //设置redis key 1小时后失效
        ctx.redis.expire(key,60*60)

        const articleList = await ctx.redis.zrevrangeAsync(key,0,-1)
        ctx.body = success(articleList.map(val=>JSON.parse(val)))
    }
})




router.get('/test',async (ctx,next)=>{
    let { url } = ctx.request.query
    const key = md5(url)
    const exist =await ctx.redis.existsAsync(key)
    if(!exist){
        const feed = await rssParser(url)
        feed.items.forEach(ele => {
            let article = {
                title:ele.title,
                link:ele.link,
                pubDate:ele.pubDate,
                author:ele.author,
                categories:ele.categories?ele.categories:[]
            }
            ctx.redis.zadd(key,(new Date(article.pubDate)).getTime(),JSON.stringify(article))
        });
        ctx.body = 1
    }else{
        let list = await ctx.redis.zrevrangeAsync(key,0,-1)
        ctx.body =success(list.map(val=>JSON.parse(val)))
    }
})

module.exports=router;