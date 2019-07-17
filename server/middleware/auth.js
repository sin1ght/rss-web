const _ = require('lodash')
const {success,error} = require('../utils')

const authWhiteList=['/api/v1/user/login','/api/v1/user/register','/api/v1/auth']

module.exports=async (ctx,next)=>{
    let path=ctx.path
    if(authWhiteList.includes(path)){
        await next()
    }else{
        if(_.isNil(ctx.session.user)){
            ctx.body=error('请先登录')
        }else{
            await next()
        }
    }
}