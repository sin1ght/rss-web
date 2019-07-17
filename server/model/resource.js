const Category = require('./category')
const User = require('./user')

const sequelize=require('../database')
const Sequelize=require('sequelize')

const Model = Sequelize.Model;
class Resource extends Model {}


Resource.init({
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        description:'资源名称',
    },
    url:{
        type:Sequelize.STRING,
        description:'rss资源链接',
    }
},{
    sequelize,
    modelName: 'resource'
})


Category.hasMany(Resource,{
    onDelete:'CASCADE',
    hooks:true,
})
Resource.belongsTo(Category)

User.hasMany(Resource,{
    onDelete:'CASCADE',
    hooks:true,
})
Resource.belongsTo(User)


// Resource.sync({force:true})

module.exports=Resource;