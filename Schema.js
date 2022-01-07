const mongoose = require('mongoose')
const user=new mongoose.Schema({
    name:{type:String,required:true},
    file_public_id:String,
    file_url:String
})
module.exports=mongoose.model('User',user)