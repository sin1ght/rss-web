const path=require('path')
const fs=require('fs')


/**
 * 将model文件夹下的model都挂载到ctx.model上
 * @param {*} ctx koa ctx
 * @param {*} next 
 */
const modelMiddleware=async (ctx,next)=>{
    const dir=path.resolve(__dirname,'../','model')
    for(let filename of fs.readdirSync(dir)){
        const modelModule=require(path.resolve(dir,filename))
        const modelName = path.basename(filename,path.extname(filename))
        if(!ctx.model){
            ctx.model={}
        }
        ctx.model[modelName]=modelModule
    }
    await next();
}

module.exports=modelMiddleware