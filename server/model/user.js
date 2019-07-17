const sequelize=require('../database')
const Sequelize=require('sequelize')

const Model = Sequelize.Model;
class User extends Model {}
User.init({
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    avatar:{
        type:Sequelize.INTEGER,
        description:'头像',
        defaultValue:'/img/avatar.jpg'    
    },
    email:{
        type:Sequelize.STRING(20),
        description:'登录邮箱'    
    },
    passwd:{
        type:Sequelize.STRING(40),
        description:'登录密码md5'    
    }
}, {
  sequelize,
  modelName: 'user'
});


// User.sync({force:true})


module.exports=User