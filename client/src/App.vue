<template>
  <div id="app">
     <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
      return {

      }
  }
}
</script>

<style lang="scss">
*{
    margin: 0;
    padding: 0;
}

div,section{
    box-sizing: border-box;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100vw;
    height: 100vh;
    font-size: 16px;
}

.ivu-input {
    &:focus{
        border-color: $theme-color-1;
        box-shadow: 0 0 2px 0 $theme-color-1;
    }
    
    &:hover{
        border-color:$theme-color-1;
    }
}

.ivu-btn:hover{
    color: $theme-color-1;
}

.ivu-btn-primary{
    background-color: $theme-color-1;
    border-color: $theme-color-1;

    &:hover{
        background-color: $theme-color-1;
        border-color: $theme-color-1;
        color: white;
    }
}

.ivu-modal-header-inner{
    color: $theme-color-1;
}
</style>
