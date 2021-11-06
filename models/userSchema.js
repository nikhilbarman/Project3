const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrpt=require('bcryptjs');



//mongoose

main().catch(err => console.log(err));

async function main() {
    // await esellRegister.save();

}


const userSchema = new mongoose.Schema({
    fname: {
        type : String,
        required : true
    },
    email: {
        type:String,
        required : true
    },
    password: {
        type:String,
        required : true
    },
    cpassword: {
        type:String,
        required : true
    },
    tokens:[
        {
            token: {
                    type:String,
                    required : true
         
        }
    }
    ]
})

///            Hashing
userSchema.pre('save',async function(next) {

        if(this.isModified('password')) {

            this.password = await bcrpt.hash(this.password, 12);
            this.cpassword = await bcrpt.hash(this.cpassword, 12);
        }
        next();
    });

    
    
    
    /// token
    
    userSchema.methods.generateAuthToken = async function(){
        try{
            let token = jwt.sign({_id: this._id}, "helkjflsdjafkljsdskjfhskjdhf16261");
            this.tokens = this.tokens.concat({ token: token});
            await this.save();
            return token;
        }
        catch(err){
            console.log(err);
        }
    }


  
const User = mongoose.model('User', userSchema);
module.exports = User;

