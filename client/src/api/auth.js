import { http } from './config'

const prefix = '/auth'

export default function isAuth(){
    return http.get(prefix)
}
