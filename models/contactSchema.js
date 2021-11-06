const mongoose=require('mongoose');
const productSchema = new mongoose.Schema({
    fname: {
        type : String,
        required : true
    },
    email: {
        type:String,
        required : true
    },
    phone: {
        type:Number,
        required : true
    },
    text: {
        type:String,
        required : true
    }
})
const contacts = mongoose.model('contact', productSchema);
module.exports = contacts;