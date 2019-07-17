<template>
    <div class="login-register-page">
        <div class="center-content">
            <div class="left-part">
                <h1>Welcome!!</h1>
                <p>{{ welcomeInfo.hitokoto }}</p>
                <p>- 「 {{ welcomeInfo.from }} 」</p>
            </div>
            <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
                mode="out-in"
                :duration="500">
                <!-- 登录 -->
                 <div class="right-part" v-if="!isRegister" key="login">
                    <div class="form" @keyup.enter="handleLogin">
                        <CustomInput label="邮箱" v-model="loginInfo.email"/>
                        <CustomInput label="密码" type="password" v-model="loginInfo.passwd"/>
                    </div>
                    <div class="action">
                        <div class="login-button" @click="handleLogin">登录</div>
                        <div class="register-button" @click="isRegister=!isRegister">注册</div>
                    </div>
                    <p class="forget-passwd-button">忘记密码 ?</p>
                </div>
                <!-- 注册 -->
                <div class="right-part" v-else key="register">
                    <div class="close-btn" @click="isRegister=!isRegister">
                        <Icon type="md-close" />
                    </div>
                    <div class="form" @keyup.enter="handleRegister">
                        <CustomInput label="邮箱" v-model="registerInfo.email"/>
                        <CustomInput label="密码" type="password" v-model="registerInfo.passwd"/>
                        <CustomInput label="确认密码" type="password" v-model="registerInfo.confirmPasswd" />
                    </div>
                    <div class="action">
                        <div class="register-button" @click="handleRegister">注册</div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>


<script>
import CustomInput from '../components/CustomInput'
import UserAPI from '../api/user'

export default {
    name:'login-register-page',
    components:{
        CustomInput
    },
    data(){
        return {
            isRegister : false,
            welcomeInfo:{},
            loginInfo:{
                email:'',
                passwd:''
            },
            registerInfo:{
                email:'',
                passwd:'',
                confirmPasswd:''
            }
        }
    },
    async created(){
        const res = await this.$http.get('https://v1.hitokoto.cn/?c=a');
        this.welcomeInfo = res.data;
    },
    methods:{
        async handleLogin(){
            if(!this.loginInfo.email || !this.loginInfo.passwd){
                //密码 邮箱不能为空
                this.$Message.error('邮箱或密码不能为空');
                return;
            }

            const res = await UserAPI.login(this.loginInfo);
            if(res.data.status){
                this.$store.user = res.data.data;
                this.$router.push('/home');
            }else{
                this.$Message.error(res.data.data);
            }
        },
        async handleRegister(){
            if(!this.registerInfo.email || !this.registerInfo.passwd){
                //密码 邮箱不能为空
                this.$Message.error('邮箱或密码不能为空');
                return;
            }

            if(this.registerInfo.passwd !== this.registerInfo.confirmPasswd){
                this.$Message.error('两次密码不一样');
                return;
            }

            const res = await UserAPI.register(this.registerInfo);
            if(res.data.status){
                this.$Message.success('注册成功');
            }else{
                this.$Message.error(res.data.data);
            }
        }
    }
}
</script>


<style lang="scss">
.login-register-page{
    width: 100vw;
    height: 100vh;
    background:$theme-color-1;
    display: flex;
    align-items: center;
    justify-content: center;

    .center-content{
        width: 50vw;
        height: 60vh;
        display: flex;
        border-radius: 3px;
        overflow: hidden;
        box-shadow: 0 0 15px 0 $theme-color-3;

        .left-part{
            width: 50%;
            height: 100%;
            background: $theme-color-2;
            color: $theme-color-white;
            display: flex;
            flex-direction: column;
            justify-content: center;

            h1{
                margin-bottom: 30px;
                font-weight: 900;
            }

            p:last-child{
                text-align: right;
                margin-top: 10px;
            }
        }

        .right-part{
            position: relative;
            width: 50%;
            height: 100%;
            background: $theme-color-white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 8%;

            .form{
                display: flex;
                flex-direction: column;
            }

            .action{
                margin-top: 30px;
                display: flex;
                justify-content: center;

                div{
                    padding: 5px;
                    color: white;
                    width: 40%;
                    cursor: pointer;
                    border-radius: 5px;
                    box-shadow: 0 0 1px 1px #e0dede;
                }

                .login-button{
                    background:$theme-color-2;
                    margin-right: 10%;
                }

                .register-button{
                    background: $theme-color-1;
                }
            }

            .forget-passwd-button{
                color: gray;
                margin-top: 20px;
                font-size: 14px;
                cursor: pointer;
                
                &:hover{
                    text-decoration: underline;
                }
            }

            .close-btn{
                position: absolute;
                right: 20px;
                top: 20px;
                background: $theme-color-1;
                color: white;
                height: 20px;
                width: 20px;
                text-align: center;
                line-height: 20px;
                border-radius: 10px;
                cursor: pointer;    
            }
        }
    }
}
</style>
