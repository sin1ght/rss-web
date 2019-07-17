const User = require('../model/user')
const Resource = require('../model/resource')
const Category = require('../model/category')


User.sync({
    force:true
})

Resource.sync({
    force:true
})

Category.sync({
    force:true
})