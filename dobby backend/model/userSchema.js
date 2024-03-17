const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:2
    },
    phone:{
        type:Number,
        unique:true,
        required:true,
        min:10
    },
    email:{
        type:String,
        unique:true,
        isVarified:false,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
},
{
timestamps:true
});
module.exports = mongoose.model('User',userSchema);