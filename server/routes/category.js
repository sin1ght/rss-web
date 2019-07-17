const Router = require('koa-router')
const _ = require('lodash')
const {success,error} = require('../utils')
const router=new Router({
    prefix:'/category'
});

/**
 * 添加分类
 */
router.post('/add',async (ctx,next)=>{
    let {name} = ctx.request.body

    //不能添加一样名字的分类
    let category = await ctx.model.category.findOne({
        where:{
            name
        }
    })
    if(_.isNil(category)){
        category = await ctx.model.category.create({
            name,
        })
        await category.setUser(ctx.session.user.id)
    
        ctx.body=success(category)
    }else{
        ctx.body=error('此分类已经添加过了')
    }
    
})

/**
 * 获取所有分类
 */
router.get('/',async (ctx,next)=>{
    let categoryList = await ctx.model.category.findAll({
        where:{
            userId:ctx.session.user.id
        },
        order: [['createdAt', 'DESC']]
    })
    ctx.body=success(categoryList)
})


/**
 * 删除分类
 */
router.get('/delete',async (ctx,next)=>{
    const { cid } = ctx.request.query

    try{
        await ctx.model.category.destroy({
            where:{
                id:cid
            }
        })
        ctx.body = success('删除成功')
    } catch {
        ctx.body = error('发生错误')
    }
})


module.exports=router;