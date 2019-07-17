import { http } from './config'

const prefix = '/user'


export default class UserAPI {
    /**
     * 登录
     * @param {Object} {email,passwd}
     */
    static login(data) {
        return http.post(prefix+'/login',data)
    }

    /**
     * 
     * @param {Object} {email,passwd}
     */
    static register(data){
        return http.post(prefix+'/register',data)
    }
}