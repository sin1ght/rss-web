import Vue from 'vue'


export const store = Vue.observable({
    user:{},//登录成功后的用户信息
    categoryList:[],//当前用户的所有rss 分类
    resourceList:[],//当前用户的所有 rss 资源链接
    articleList:[],//所有文章
    rssId:-1,//当前rss id
    isLoading:false,
    contextMenuCId:-1,//右键菜单时的分类id
    contextMenuRId:-1,//右键菜单时的rss id
})