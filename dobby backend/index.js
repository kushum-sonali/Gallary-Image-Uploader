const express= require("express")
const cors=require("cors")       
const app= express();
require("./Database/config");
const User=require("./model/userSchema");
app.use(express.json());
app.use(cors());
const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken")
const bp= require("body-parser");
var nodemailer = require('nodemailer');
const dotenv=require("dotenv");
const upload = require('./Database/multer');
const Image= require("./model/imageSchema");
const cloudinary = require("cloudinary").v2;
dotenv.config();
const port= process.env.PORT||5000; 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

app.post('/upload-image', upload.single('file'), async(req, res) => {
    try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    const { name,user } = req.body;
    const image = new Image({
      name,
      path: cldRes.secure_url,
      user,
    });
    const result = await image.save();
    res.status(200).json({message:"image uploaded successfully",result});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
  });


app.get("/images/:id",async(req,res,next)=>{
  try{
    const {id}=req.params;
    const result= await Image.find({user:id});
    res.status(200).json(result);
  }
  catch(err){
    next(err);
  }
}
)
app.post("/signup",async(req,res,next)=>{
try{
    const {username,email,phone,password}=req.body;
    console.log(req.body)
    if(!username || !email || !phone || !password){
     return res.status(400).json({error:"all field is required"});
    }
    const saltRounds=10;
   const hashpass= await bcrypt.hash(password, saltRounds);

    const newuser= new User({
        username,
        email,
        phone,
        password:hashpass
    })

    const result=await newuser.save();
    const token =  jwt.sign({name:result.username,
        email:result.email
    },
     process.env.JWT_SECRET
     ,{expiresIn: 60*60})

    const userRes = {token,uid:result._id}

    res.status(200).json({message:"signup succesfully",userRes});
}
catch(err){
    next(err);
}
})
app.post("/login",async(req,res,next)=>{
    try{
        const {email,password}=req.body;   
        
        if( !email || !password){
            return res.status(400).send("email and password is required");
        }   
        const userfind= await User.findOne(
         {email}
        )
        
        if(!userfind){
         return res.status(404).send("user not found")
         
        }  
        
        const matchpass= await  bcrypt.compare(password,userfind.password) ;
        if(!matchpass){
            return res.status(401).send("username or password not matched");
        }
            // return res.send("login succesfully");
      const token =  jwt.sign({name:userfind.username,
            email:userfind.email
        },
         process.env.JWT_SECRET
         ,{expiresIn: 60*60})
        const userRes = {token,uid:userfind._id}
        res.status(200).json({message:"login successfully",userRes}); 
    }

    catch(err){
next(err);
    }
})
app.post('/message', async(req,res,next)=>{
    try{
        const {name,email,message}=req.body;
        if(!name || !email || !message){
            return res.status(400).send("require all field");
        }
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
            }
          });
          
          var mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: `message from ${name}`,
            text: `name:${name} email:${email}  message:${message}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              return res.status(400).send(error);
            } else {
              console.log('Email sent: ' + info.response);
              return res.status(200).send("Email sent: " + info.response);
              
            }
          });
    }
    catch(err){
        next(err);
    }
}
)
app.post("/forgetpass",async(req,res,next)=>{
    const {email}=req.body;
  try{
    const user= await User.findOne({email:email});
if(!user){
    return res.status(404).send("user not found");
  }
    const token=jwt.sign({id:user._id},"sonali"+user.password,
    {expiresIn:60*60});
   

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

var mailOptions = {
  to: email,
  subject: 'Reset your password',
  text: `http://localhost:5173/reset-password/${user._id}/${token}`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
    return res.status(200).send("Email sent: " + info.response);
  }
});
}
    catch(err){
        next(err);
    }

})
app.post("/reset-password/:id/:token",async(req,res,next)=>{
    try {
        const {id,token}=req.params;
        const user=await User.findOne({_id:id});
        if(!user){
            return res.status(404).send("user not found");
        }
        const payload= jwt.verify(token,"sonali"+user.password);
        if(!payload){
            return res.status(401).send("token not matched");
        }
        const {password}=req.body;
        if(!password){
            return res.status(400).send("password is required");
        }
        const saltRounds=10;
        const hashpass= await bcrypt.hash(password, saltRounds);

        user.password=hashpass;
        await user.save();
         res.status(200).send("password changed succesfully");


             
       
}
    catch(err){
        next(err);
    }
}
)
app.listen(port,()=>{//two parameter port and callback function
    console.log(`server is running at ${port}`)
})