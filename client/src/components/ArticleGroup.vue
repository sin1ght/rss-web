<template>
    <div class="article-group">
        <p>{{ group.title }}</p>
        <div class="article-list">
            <ArticleListItem v-for="(item,index) in group.items" :key="index" :article="item"/>
        </div>
    </div>
</template>


<script>
import ArticleListItem from './ArticleListItem'

export default {
    name:'article-group',
    components:{
        ArticleListItem,
    },
    props:{
        group:{
            type:Object,
            required:true,
        }
    }
}
</script>

<style lang="scss">
.article-group{
    margin-bottom:30px; 

    >p{
        margin-bottom: 5px;
        color: $theme-color-2;
    }

    .article-list-item:first-child{
        border-top: 1px solid #dae4e4;
    }
}
</style>
