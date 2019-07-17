import { http } from './config'

const prefix = '/category'


export default class CategoryAPI {
    
    /**
     * 获取用户所有rss 分类
     */
    static getAll(){
        return http.get(prefix)
    }
    
    /**
     * 添加分类
     * @param {*} data {name}
     */
    static add(data){
        return http.post(prefix+'/add',data)
    }

    /**
     * 删除分类
     * @param { Number} id
     */
    static delete(id){
        return http.get(prefix+'/delete',{
            params:{
                cid:id
            }
        })
    }
}