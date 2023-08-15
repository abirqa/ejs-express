const express = require('express');
const ForgotPasswordRouter = express.Router();
const UserModel = require('../models/userModel');
const emailValidator = require('email-validator');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

ForgotPasswordRouter.use(express.json());

ForgotPasswordRouter.post('/', async (req, res)=>{
    try {
        
        const { email } = req.body;

        // Check if Email field left blank
        if(email == '' ){
          return res.status(400).json({
            data : {
                message: "Email Field Cannot be Blank!",
            }
          })  
        }

        // Check if its a valid email or not
        if(email && !emailValidator.validate(email)){
           return res.status(403).json({
                data : {
                    message: "Email ID is not Valid! Please enter a valid email",
                }
            })
        }

        //Check if Email ID exists in Mongo DB//
        const user = await UserModel.findOne({ email: email });
        if(!user) {
           return res.status(404).json({
                data : {
                    message: "Sorry! Email ID not Found",
                }
            })
        }

        /**
         * If all the above validation succeeds, execute rest of the code
         * 1) generate a jwt token
         * 2) send the reset link to the user
         */
        
        // Generate Unique JWT for password reset link //
        const secret = process.env.PRIVATE_JWT_KEY + user.password;
        const resetpwdtoken = jwt.sign(
            {email: user.email, userId: user.user_id}, 
            secret,
            {expiresIn: '1m'},
        );

        //If all the above validations passed, send password reset link to user//
        const resetLink = `/api/v1/reset-password/${user.user_id}/${resetpwdtoken}`;

        //console.log(resetLink); 

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'abirbose57@gmail.com',
              pass: 'ztdfosotzeetnnqr',
            }
          });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'One-Time Password Reset Link for Node/Express Application',
            text: resetLink,
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.status(201).json({
            data: {
                success : 'Password Reset Link Sent on your Registered Email',
            },
        });
        
    } catch (error) {
        console.log(error);
    }
    
});



module.exports = ForgotPasswordRouter;