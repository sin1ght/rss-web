const Router = require('koa-router')
const _ = require('lodash')
const {success,error,md5} = require('../utils')
const router=new Router({
    prefix:'/user'
});


/**
 * 登录
 */
router.post('/login',async (ctx,next)=>{
    let {email,passwd} = ctx.request.body
    //查看邮箱是否注册
    let user=await ctx.model.user.findOne({
        where:{email}
    });
    if(!user){
        ctx.body=error('未知账户');
    }else{
        if(md5(passwd) === user.passwd){
            ctx.session.user=user;
            ctx.body=success(_.pick(user,['avatar','id','email']));
        }else{
            ctx.body=error('密码错误');
        }
    }
})


/**
 * 注册
 */
router.post('/register',async (ctx,next)=>{
    let {email,passwd}=ctx.request.body
    //查看是否已经存在此邮箱用户
    let user=await ctx.model.user.findOne({
        where:{email}
    });
    if(user){
        ctx.body=error('此邮箱已经被注册过了');
    }else{
        user=await ctx.model.user.create({
            email,
            passwd:md5(passwd)
        })
        ctx.body=success(user)
    }
})


module.exports=router;
