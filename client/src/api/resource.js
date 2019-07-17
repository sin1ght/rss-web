import { http } from './config'

const prefix = '/resource'


export default class ResourceAPI {
    
    /**
     * 获取用户所有rss资源链接
     */
    static getAll(){
        return http.get(prefix)
    }
    
    /**
     * 添加分类
     * @param {*} data { url,categoryId }
     */
    static add(data){
        return http.post(prefix+'/add',data)
    }

    /**
     * 获取rss 文章
     * @param { Number} id 
     */
    static getArticleList(id){
        return http.get(prefix+'/article',{
            params:{
                rssId:id
            }
        })
    }

    /**
     * 刷新文章 重新拉取rss
     * @param { Number} id 
     */
    static refreshArticle(id){
        return http.get(prefix+'/article/refresh',{
            params:{
                rssId:id
            }
        })
    }

    /**
     * 删除rss
     * @param { Number} id 
     */
    static delete(id){
        return http.get(prefix+'/delete',{
            params:{
                rssId:id
            }
        })
    }
}