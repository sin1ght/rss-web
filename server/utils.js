const Parser = require('rss-parser');
const crypto = require('crypto'); 

/**
 * 解析rss链接
 * @param {string} url rss地址
 * @returns {object} feed 
 * https://www.freebuf.com/feed
 */
async function rssParser(url){
    const parser = new Parser();
    let feed = await parser.parseURL(url);
    return feed;
}

/**
 * 请求成功返回体
 * @param {object|string} data 
 */
function success(data){
    return {
        status:true,
        data:data
    }
}

/**
 * 请求失败返回体
 * @param {object|string} data 
 */
function error(data){
    return {
        status:false,
        data:data
    }
}


/**
 * md5
 */
function md5(str){
    let hash = crypto.createHash('md5');
    return hash.update(str).digest('hex');
}

/**
 * 根据url拉取文章 或者 从redis中获取
 * @param {koa.ctx} ctx
 * @param {Stirng} url // rss
 * @param {Number} id // rss id
 * @returns { Array } articleList
 */
async function getRssArticleList(ctx,url,id){
    const key = md5(url)
    const isExist =await ctx.redis.existsAsync(key)
    let articleList = []
    if(isExist){
        articleList = await ctx.redis.zrevrangeAsync(key,0,-1)
        articleList = articleList.map(val => JSON.parse(val))
    }else{
        const feed = await rssParser(url)
        feed.items.forEach(ele => {
            let article = {
                rssId:id,
                title:ele.title,
                link:ele.link,
                pubDate:ele.pubDate,
                author:ele.author ? ele.author : ele['dc:creator'],
                categories:ele.categories ? ele.categories:[]
            }
            ctx.redis.zadd(key,(new Date(article.pubDate)).getTime(),JSON.stringify(article))
            articleList.unshift(article)
        });
        //设置redis key 1小时后失效
        ctx.redis.expire(key,60*60)
    }

    return articleList;
}


module.exports={
    rssParser,
    success,
    error,
    md5,
    getRssArticleList
}

// rssParser('https://paper.seebug.org/rss/').then(res=>{
//     console.log(res.items[0])
//     const item =res.items[0];
//     let article ={
//         title:item.title,
//         link:item.link,
//         pubDate:item.pubDate,
//         author:item.author ? item.author : item['dc:creator'],
//         categories:item.categories?item.categories:[]
//     }
//     console.log(JSON.stringify(article))
// })
