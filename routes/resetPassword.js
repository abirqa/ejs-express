const express = require('express');
const ResetPasswordRouter = express.Router();
const UserModel = require('../models/userModel');
const emailValidator = require('email-validator');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

ResetPasswordRouter.use(express.json());

ResetPasswordRouter.get('/:userId/:token', async (req, res)=>{
    try {
        const { userId, token } = req.params;
        // console.log(req.params);
        // res.send({
        //     data:{
        //         message: "Done",
        //     }
        // })

        const user = await UserModel.findOne({user_id : userId}); 
        if(!user){
            return res.status(404).json({message: "User Not Found!"});
        }
        
        const secret = process.env.PRIVATE_JWT_KEY + user.password;

        try {
           const verify = jwt.verify(token, secret);
           console.log(verify);
           res.render('resetPassword', {email: verify.email, userId: verify.userId, token: token});
           //res.json({message: "verified"});
            
        } catch (error) {
            res.json({message: "Not Verified"});
            console.log(error);
        }
        
    } catch (error) {
        console.log(error)
    }
})

ResetPasswordRouter.post('/:userId/:token', async (req, res)=>{
        const { userId, token } = req.params;
        const {password, confirmPassword} = req.body;

        const user = await UserModel.findOne({user_id : userId}); 
        if(!user){
            return res.status(404).json({message: "User Not Found!"});
        }
        
        const secret = process.env.PRIVATE_JWT_KEY + user.password;

        if(password.length < 6) {
            return res.status(403).json({message: "Password needs to be 6 Characters Long"})
        }
        
        if(password !== confirmPassword) {
           return res.status(401).json({message: "Password & Confirm Password doesn't matched"})
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await UserModel.updateOne(
                {
                    user_id : userId,
                },
                {
                    $set: {
                        password: hashedPassword,
                    },
                }
            );

            res.status(200).json({success_message: "New Password has been Updated"})
            
        } catch (error) {
            res.send("Something Went Wrong!");
            console.log(error);        
        }
})

module.exports = ResetPasswordRouter;