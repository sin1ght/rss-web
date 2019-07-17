<template>
    <div class="custom-input">
        <transition
            enter-active-class="animated fadeInUp"
        >
            <label v-show="isLabelVisible">{{ label }}</label>
        </transition>
        <input :type="type" :placeholder="placeholder" :value="value" @focus="handleFocus" @blur="handleBlur" @input="handleChange($event)">
    </div>
</template>


<script>
export default {
    name:'custom-input',
    props:{
        label:{
            type:String,
            required:true,
        },
        type:{
            type:String,
            default:'text'
        },
        value:{
            type:String,
            required:true,
        }
    },
    data(){
        return {
            placeholder:'',
            isLabelVisible:false,
        }
    },
    created(){
        this.placeholder=this.label;
    },
    methods:{
        handleFocus(){
            this.isLabelVisible=true;
            this.placeholder='';
        },
        handleBlur(){
            this.isLabelVisible=false;
            this.placeholder=this.label;
        },
        handleChange(event){
            this.$emit('input',event.target.value);
        }
    }
}
</script>


<style lang="scss">
.custom-input{
    display: flex;
    flex-direction: column;

    label{
        font-size: 14px;
        text-align: left;
        padding-left:5px;
        color: #79a8a9; 
    }

    input{
        border:none;
        padding: 5px;
        background: none;
        border-bottom: 1px #d9dedeb8 solid;
        outline: none;
        margin-bottom: 15px;
    }
}
</style>
