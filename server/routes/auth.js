const Router = require('koa-router');
const _ = require('lodash')
const {success,error} = require('../utils')
const router=new Router({
    prefix:'/auth'
});


/**
 * 判断用户是否登录
 */
router.get('/',async (ctx,next)=>{
    if(_.isNil(ctx.session.user)){
        ctx.body=error('未登录')
    }else{
        ctx.body=success(_.pick(ctx.session.user,['avatar','id','email']));
    }
})


module.exports = router