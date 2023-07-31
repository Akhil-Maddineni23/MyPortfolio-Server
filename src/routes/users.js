const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel  = require('../models/Users.js');

const router = express.Router();

router.post("/login" , async (req , res) => {
    const {email , password} = req.body;
    const user = await UserModel.findOne({email : email});
  
    if(!user){
        return res.json({ status : false , messgae : "Email Id doesn't Exists!!!"})
    }
    const isPasswordValid = await bcrypt.compare(password , user.password);
    if(!isPasswordValid){
        return res.json({ status : false , message : "Email ID or Password Incorrect"});
    }

    const token = jwt.sign({id : user._id} , "secret");
    return res.json({ status : true , token , userID :user._id , userName : user.username});
});




module.exports = router;