<template>
    <div class="article-list-item">
        <div class="info">
            <p><Icon type="ios-person-outline" />{{ article.author }}</p>
            <p>{{ $moment(new Date(article.pubDate)).format('A hh:mm') }}</p>
        </div>
        <div class="title">
            <p @click="handleArticleOpen(article.link)">{{ article.title }}</p>
            <div class="action">
                <Icon type="md-star-outline" />
                <Icon type="md-time" />
            </div>
        </div>
        <div class="category">
            <p v-for="(c,index) in article.categories" :key="index">
               <Icon type="ios-pricetag-outline" />{{ c }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name:'article-list-item',
    props:{
        article:{
            type:Object,
            required:true,
        }
    },
    methods:{
        //打开文章链接
        handleArticleOpen(url){
            window.open(url,'_blank')
        }
    }
}
</script>

<style lang="scss">
.article-list-item{
    border-bottom:1px solid #dae4e4; 
    padding: 5px 0; 

    .info{
        color: gray;
        font-size: 14px;
        display: flex;

        p{
            margin-right: 10px;

            &:first-child{
                display: flex;
                align-items: center;
            }
        }

        .ivu-icon{
            margin-right:5px; 
        }
    }

    .title{
        display: flex;

        p{
            max-width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right:10px; 
            cursor: pointer;
        }

        .action{
            .ivu-icon{
                cursor: pointer;
                margin-right:10px; 
            }
        }
    }

    .category{
        color: gray;
        display: flex;
        flex-wrap: wrap;
        font-size: 14px;

        p{
            margin-right:10px;
        }

        .ivu-icon{
            margin-right:5px; 
        }
    }
}
</style>
