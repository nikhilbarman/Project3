const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
mongoose.connect("mongodb+srv://nikhil:Nikhil7042@cluster0.ct8vu.mongodb.net/foodBlogs?retryWrites=true&w=majority",
{useNewUrlParser:true},()=>{
console.log("mongo server connected");
})
const contacts = require("./models/contactSchema.js");
const User = require("./models/userSchema.js");

app.post("/contactus", async(req, res)=> {
        try{
        const {fname, email, phone, text} = req.body;
        if (!fname || !email || !phone || !text ) {
            return res.status(422).json({ error: "Plz filled the field properly"});
        }
                    // const data = req.body;
                    const contactus = new contacts({fname, email, phone, text});
                    var contactusdata  = await contactus.save();
                    res.status(201).json({ status: 201, message: "Your Submission has been sent 😁"}); 
                    history.back();
        } catch(error) {
            console.log('Error: ', error.message);
            res.send(error);
        }
});


app.post("/signup", async(req, res)=> {
    const {fname, email, password, cpassword} = req.body;
    if (!fname || !email || !password || !cpassword ) {
        return res.status(422).json({ error: "Plz filled the field properly"});
    }
    try{
                        //Email-Exist
        const userExist = await User.findOne({email});
            if (userExist) {
                return res.status(422).json({status:422,error: "Email already Exist"});
            
        }
                        //Password-Matching
            if(password === cpassword){

                const user = req.body;
                const register = new User({fname, email, password, cpassword});
                var userRegister  = await register.save();
                res.status(201).json({ status: 201, message: " user registered succesfully"});
            }
            else{return res.status(422).json({ error: "Password are not matching!!" });}
    } catch(error) {
        console.log('Error: ', error.message);
    }
});


app.post("/signin", async(req, res)=> {
    try {
        let token;
        const { email, password} =req.body;
        if(!email || !password){
            return res.status(400).json({error:"please Filled the data"})
        }
        const userLogin = await User.findOne({ email: email});
        if(userLogin){

            const isMatch = await bcrypt.compare(password, userLogin.password);
//                  token-start
            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token,{
                expires:new Date(Date.now() + 2592000000),
                httpOnly:true
            });
            
//                  token-end


            if (!isMatch){
                return res.status(400).json({error:"Invalid Credientials!"});
            }else{
                res.status(202).json({message:"user Login Successfully"});
                // window.alert("Invalid Credentials");
            } 
    
        }else{
                return res.status(400).json({ error:"Invalid Credientials!"});
        }

      

    }catch (error) {
        console.log('Error: ',error.message);
    }

});

app.get("/logedin", async(req,res,next)=>{

    try {
        const token = req.cookies.jwtoken;

        const verifyToken = jwt.verify(token, "helkjflsdjafkljsdskjfhskjdhf16261");

        const rootUser = await User.findOne({_id: verifyToken._id, "tokens.token": token });
        if (!rootUser){ throw new Error('User not found')}
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        res.send(req.rootUser);
        next()
    } catch (err) {
        res.status(401).send('Unauthorized: No token provided');
        console.log(err);
    }
});

const port = process.env.PORT || 8000;
const static_path = path.join(__dirname, "./");
app.use(express.static(static_path));
app.listen(port,()=>{
    console.log(`server is running ${port}`);
});