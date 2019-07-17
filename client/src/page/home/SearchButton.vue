<template>
    <div class="search-button">
        <transition name="search-button">
            <input type="text" v-if="isCollapse">
        </transition>
        <Icon type="ios-search" size="20" @click="isCollapse=!isCollapse" :class="{'not-collapse-icon':!isCollapse}"/>
    </div>
</template>


<script>
export default {
    name:'search-button',
    data(){
        return {
            isCollapse:false,
        }
    }
}
</script>


<style lang="scss">
@keyframes  search-button-in{
    from{
        width: 0;
    }
    to{
        width: 200px;
    }
}

@keyframes  search-button-out{
    from{
        width: 200px;
    }
    to{
        width: 0;
    }
}

.search-button-enter-active {
  animation: search-button-in .5s ease-in forwards;
}
.search-button-leave-active {
  animation: search-button-out .3s ease-out forwards;
}


.search-button{
    box-shadow: 0 0 15px 0 gray;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 25px;
    overflow: hidden;
    height: 50px;
    position: relative;

    input{
        border: none;
        outline: none;
        padding: 5px;
        background: transparent;
        height: 40px;
        width: 200px;
    }

    .ivu-icon{
        cursor: pointer;
    }

    .not-collapse-icon{
        margin: 10px 5px;
    }

}
</style>
