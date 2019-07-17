const User = require('./user')

const sequelize=require('../database')
const Sequelize=require('sequelize')

const Model = Sequelize.Model;
class Category extends Model {}

Category.init({
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        description:'分类名称',
    }
},{
    sequelize,
    modelName: 'category'
})


User.hasMany(Category,{
    onDelete:'CASCADE',
    hooks:true,
})
Category.belongsTo(User)

// Category.sync({force:true})

module.exports=Category