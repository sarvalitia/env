//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");


const app=express();



app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB" ,{ useNewUrlParser: true  ,useUnifiedTopology: true });

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});



const User=new mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});



app.post("/login",function(req,res){
  User.findOne({email:req.body.username},function(err,result){
if(!err){
  if(result){
    if(req.body.password===result.password){
      res.render("secrets");
    }
  }
}
})
});



app.get("/submit",function(req,res){
  res.render("submit");
});


app.post("/submit",function(req,res){

});



app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){

  const user=new User({
    email:req.body.username,
    password:req.body.password
  });
  user.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  })
});




app.listen(3000,function(){
  console.log("server running on port 3000");
})
