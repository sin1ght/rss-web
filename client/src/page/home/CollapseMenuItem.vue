<template>
    <div class="collapse-menu-item item">
        <div @click="collapse=!collapse" @contextmenu="handleCategoryContextMenu">
            <Icon v-if="!collapse" type="ios-arrow-forward" />
            <Icon v-else type="ios-arrow-down" />
            <p>{{ name }}</p>
            <Icon type="md-add" @click.stop="handleRssAddClick"/>
        </div>
        <transition
            name="list" 
        >
            <div v-if="collapse" class="content-list">
                <p 
                    v-for="item in rssList" 
                    :key="item.id" 
                    :title="item.name"
                    :class="{'active-rss':item.id === $store.rssId}" 
                    @contextmenu="handleRssContextMenu($event,item.id)" 
                    @click="handleRssItemClick(item.id)"
                >
                    {{ item.name }}
                </p>
            </div>
        </transition>
    </div>
</template>

<script>
import ResourceAPI from '../../api/resource'

export default {
    name:'collapse-menu-item',
    props:{
        name:{ //rss分类的名称
            type:String,
            required:true,
        },
        id:{ // rss分类的id,通过这个id获取此分类的rss链接
            type:Number,
            required:true,
        }
    },
    data(){
        return {
            collapse:false,
        }
    },
    computed:{
        //此分类的所有rss链接
        rssList(){
            return this.$store.resourceList.filter(item=>item.categoryId === this.id)
        }
    },
    methods:{
        //添加rss链接 到当前分类
        handleRssAddClick(){
            this.$emit('onAddRss',this.id);
        },
        handleCategoryContextMenu(e){
            this.$store.contextMenuCId = this.id;
            e.preventDefault();
            const dom=document.querySelector('#categoryContextMenu');
            dom.style.top=e.clientY;
            dom.style.left=e.clientX;
            this.$parent.$refs.categoryContextMenu.currentVisible=true;
            this.$parent.$refs.categoryContextMenu.$refs.reference = e.target;
        },
        handleRssContextMenu(e,id){
            this.$store.contextMenuRId =id;
            e.preventDefault();
            const dom=document.querySelector('#rssContextMenu');
            dom.style.top=e.clientY;
            dom.style.left=e.clientX;
            this.$parent.$refs.rssContextMenu.currentVisible=true;
            this.$parent.$refs.rssContextMenu.$refs.reference = e.target;
        },
        async handleRssItemClick(id){
            this.$store.rssId = id;
            this.$store.isLoading = true;

            const res = await ResourceAPI.getArticleList(id)

            if(res.data.status){
                this.$store.articleList=res.data.data;
            }else{
                this.$Message.error(res.data.data);
            }
            this.$store.isLoading = false;
            //滚动到顶部
            document.querySelector('.home-page .center-content >div:last-child').scrollTop = 0;
        }
    } 
}
</script>

<style lang="scss">
@keyframes list-in {
    from{
        max-height: 0;
    }
    to{
        max-height:200px;
    }
}

@keyframes list-out {
    from{
        max-height:200px;
    }
    to{
        max-height: 0;
    }
}

.list-enter-active {
  animation: list-in .5s ease-in forwards;
}

.list-leave-active {
  animation: list-out .5s ease-out forwards;
}

.collapse-menu-item{
    
    p{
        width: 80%;
        text-align: left;
    }
    

    .content-list{
        overflow: hidden;

        p{
            padding: 5px 0 5px 30px;
            cursor: pointer;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;


            &:hover{
                background: $theme-color-1;
            }
        }

        .active-rss{
            background: $theme-color-1;
        }
    }
}
</style>
