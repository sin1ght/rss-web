const Router = require('koa-router');
const path = require('path')
const fs = require('fs')
const router=new Router()


for(let filename of fs.readdirSync(path.resolve(__dirname))){
    if(!filename.startsWith('index')){
        const routerModule=require(path.resolve(__dirname,filename))
        router.use('/api/v1',routerModule.routes(),routerModule.allowedMethods());
    }
}


module.exports=router;
