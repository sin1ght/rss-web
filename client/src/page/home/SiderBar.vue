<template>
    <div class="sider-bar">
        <div class="user">
            <img :src="userAvatar">
        </div>
        <div class="menu">
            <div class="group">
                <div class="item">
                    <div>
                        <Icon type="md-time" />
                        <p>稍后读</p>
                    </div>
                </div>
                <div class="item">
                    <div>
                        <Icon type="md-star-outline" />
                        <p>收藏</p>
                    </div>
                </div>
            </div>

            <div class="group">
                <CollapseMenuItem 
                    v-for="item in categoryList" 
                    :key="item.id" 
                    :name="item.name" 
                    :id="item.id" 
                    @onAddRss="openRssAddModal($event)"/>
            </div>
            
            <div class="group">
                <div class="item">
                    <div>
                        <Icon type="ios-help-circle-outline" />
                        <p>帮助</p>
                    </div>
                </div>
                <div class="item">
                    <div>
                        <Icon type="ios-mail-open-outline" />
                        <p>问题反馈</p>
                    </div>
                </div>
                <div class="item">
                    <div>
                        <Icon type="ios-information-circle-outline" />
                        <p>关于</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="action">
            <Icon type="md-refresh" @click="refreshArticleBtnClick"/>
            <Icon type="md-add" @click="categoryModal=!categoryModal"/>
        </div>

        <!-- 添加分类模态框   -->
        <Modal
            v-model="categoryModal"
            title="添加分类"
            @on-ok="handleAddCategory"
            @keyup.enter.native="handleAddCategory"
        >
            <Input v-model="categoryName" placeholder="请输入分类名称"/>
        </Modal>

        <!-- 添加rss资源 -->
        <Modal
            v-model="rssModal"
            title="添加rss链接"
            @on-ok="handleAddRss"
            @keyup.enter.native="handleAddRss"
        >
            <Input v-model="rssUrl" placeholder="请输入完整url"/>
        </Modal>

        <!-- 分类上下文菜单 -->
        <Dropdown
            trigger="click" 
            ref="categoryContextMenu"
            id="categoryContextMenu"
            style="display:fixed;"
            :transfer="true"
            @on-click="handleCategoryContextMenu">
            <DropdownMenu slot="list">
                <DropdownItem name="rename">重命名</DropdownItem>
                <DropdownItem name="delete" style="color: #ed4014;">删除</DropdownItem>
            </DropdownMenu>
        </Dropdown>

        <!-- rss资源项目上下文菜单 -->
        <Dropdown
            trigger="click" 
            ref="rssContextMenu"
            id="rssContextMenu"
            style="display:fixed;"
            :transfer="true"
            @on-click="handleRssContextMenu">
            <DropdownMenu slot="list">
                <DropdownItem name="rename">重命名</DropdownItem>
                <DropdownItem name="delete" style="color: #ed4014;">删除</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>


<script>
import CollapseMenuItem from './CollapseMenuItem'
import CategoryAPI from '../../api/category';
import ResourceAPI from '../../api/resource';

export default {
    name:'sider-bar',
    components:{
        CollapseMenuItem
    },
    data(){
        return {
            categoryModal:false,
            rssModal:false,
            categoryName:'',//添加分类的名称
            rssUrl:'',//添加rss的url
            addRssCategoryId:-1,//添加rss时的分类id
            refreshArticleBtnClick:null,
        }
    },
    created(){
        this.refreshArticleBtnClick = this.throttle(this.handleArticleRefresh)
    },
    computed:{
        //用户头像
        userAvatar(){
            return this.$store.user.avatar;
        },
        //用户rss分类
        categoryList(){
            return this.$store.categoryList;
        },
    },
    methods:{
        openRssAddModal(id){
            this.addRssCategoryId = id;
            this.rssModal = !this.rssModal;
        },
        //添加rss分类
        async handleAddCategory(){
            this.categoryModal = false;

            if(!this.categoryName){
                this.$Message.error('分类名称不能为空');
                return;
            }

            const res = await CategoryAPI.add({
                name:this.categoryName.trim(),
            })
            if(res.data.status){
                this.$store.categoryList.unshift(res.data.data);
            }else{
                this.$Message.error(res.data.data);
            }
        },
        //添加rss
        async handleAddRss(){
            this.rssModal = false;

            if(!this.rssUrl){
                this.$Message.error('rss资源链接不能为空');
                return;
            }

            const res = await ResourceAPI.add({
                url:this.rssUrl,
                categoryId:this.addRssCategoryId,
            })
            
            if(res.data.status){
                this.$store.resourceList.unshift(res.data.data.resource);
            }else{
                this.$Message.error(res.data.data);
            }

        },
        //刷新文章 再次拉取文章 查看是否有新的文章
        async handleArticleRefresh(){
            this.$store.isLoading = true;

            const res = await ResourceAPI.refreshArticle(this.$store.rssId)
            if(res.data.status){
                this.$store.articleList=res.data.data;
            }else{
                this.$Message.error(res.data.data);
            }

            this.$store.isLoading = false;
        },
        //节流
        throttle(fn){
            let map = {};
            return ()=>{
                if(!map[this.$store.rssId]){
                    map[this.$store.rssId]=true
                    fn()
                    setTimeout(()=>{map[this.$store.rssId]=false},5*60*1000)
                }else{
                    this.$Message.error('不要频繁刷新')
                }
            }
        },
        //分类上下文菜单
        async handleCategoryContextMenu(op){
            if(op === 'delete'){
                const res = await CategoryAPI.delete(this.$store.contextMenuCId)
                if(res.data.status){
                    if(res.data.status){
                        //删除store里面的数据
                        const index = this.$store.categoryList.findIndex(item=>item.id === this.$store.contextMenuCId)
                        if(index !== -1){
                            this.$store.categoryList.splice(index,1)
                        }else{
                            this.$Message.error('发生错误')
                        }
                    }else{
                        this.$Message.error(res.data.data)
                    }
                }
            }

        },
        //rss 上下文菜单
        async handleRssContextMenu(op){
            if(op === 'delete'){
                const res = await ResourceAPI.delete(this.$store.contextMenuRId)
                if(res.data.status){
                    if(res.data.status){
                        //删除store里面的数据
                        const index = this.$store.resourceList.findIndex(item=>item.id === this.$store.contextMenuRId)
                        if(index !== -1){
                            this.$store.resourceList.splice(index,1)
                        }else{
                            this.$Message.error('发生错误')
                        }
                    }else{
                        this.$Message.error(res.data.data)
                    }
                }
            }
        }
    }
}
</script>


<style lang="scss">
.sider-bar{
    color: $theme-color-white;
    height: 100%;
    position: relative;

    .user{
        display: flex;
        justify-content: center;
        align-items: center;

        img{
            width: 80px;
            height: 80px;
            border-radius: 40px;
            margin: 20px 0;
        }
    }

    .menu{
        height: 70%;
        overflow-y:auto;

        &::-webkit-scrollbar{
            width: 0;
        } 

        .group{
            margin-bottom: 40px; 

            .item{
                >div:first-child{
                    padding: 5px 10px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;

                    p{
                        margin: 0 5px;
                    }
                    
                    .ivu-icon{
                        font-weight: bold;
                    }

                    &:hover{
                        background: $theme-color-1;
                    }
                }
            }
        }
        
    }

    .action{
        position:absolute;
        bottom: 0;
        left: 0;
        padding: 10px 10px;
        width: 100%;


        .ivu-icon{
            cursor: pointer;
            font-weight: bold;
        }

        .ivu-icon:first-child{
            margin-right: 80%; 
        }

    }

}
</style>
