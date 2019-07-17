<template>
    <div class="home-page">
        <div class="center-content">
            <div>
                <SiderBar/>
            </div>
            <div :style="{background:$store.isLoading?'#d4dcdcc4':'none'}">
                <SearchButton v-if="articleGroups.length > 0"/>
                <ArticleGroup v-for="(group,index) in articleGroups" :key="index" :group="group"/>
                <div class="nothing" v-if="articleGroups.length === 0">
                   <Icon type="ios-snow-outline"  size="300" style="color:#c5d0d0a1;"/>
                </div>
                <Loading class="loading-wrapper" v-if="$store.isLoading"/>
                
            </div>
        </div>
    </div>
</template>


<script>
import SiderBar from './SiderBar'
import SearchButton from './SearchButton'
import ArticleGroup from '../../components/ArticleGroup'
import CategoryAPI from '../../api/category'
import ResourceAPI from '../../api/resource'
import Loading from '../../components/Loading'


export default {
    name:'home-page',
    components:{
        SiderBar,SearchButton,ArticleGroup,Loading
    },
    async created(){
        //请求当前用户的所有rss 分类
        const res = await CategoryAPI.getAll()
        this.$store.categoryList = res.data.data

        //请求当前用户的所有 rss资源链接
        const res2 = await ResourceAPI.getAll()
        this.$store.resourceList = res2.data.data
    },
    computed:{
        //当前rss 根据日期将文章分类
        articleGroups(){
            let as=this.$store.articleList.filter(item=>item.rssId === this.rssId)
            let groups = [];
            let map = {};

            as.forEach(ele => {
                let time = this.$moment(new Date(ele.pubDate)).format('YYYY年MM月DD dddd')
                if(map[time]){
                    map[time].push(ele);
                }else{
                    map[time]=[ele]
                }
            });

            Object.keys(map).forEach(key=>{
                groups.push({
                    title:key,
                    items:map[key]
                })
            })

            return groups;
        },
        rssId(){
            return this.$store.rssId
        },
        articleList(){
            return this.$store.articleList
        }
    }

}
</script>


<style lang="scss">
.home-page{
    width: 100vw;
    height: 100vh;
    background: $theme-color-1;
    display: flex;
    justify-content: center;
    align-items: center;

    .center-content{
        background: $theme-color-white;
        width:70vw;
        height:90vh;
        border-radius: 5px;
        box-shadow: 0 0 15px 0 $theme-color-3;
        display: flex;

        >div:first-child{
            width: 25%;
            background: $theme-color-2;
        }

        >div:last-child{
            width: 75%;
            position: relative;
            text-align: left;
            padding: 10px;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 0;
            }

            .search-button{
                position:fixed;
                right:calc(15vw + 20px);
                top: calc(5vh + 20px);
            }

            .nothing{
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .loading-wrapper{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                z-index: 2;
            }
        }
    }
}
</style>
