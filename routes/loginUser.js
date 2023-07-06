const express = require('express');
const loginUserRouter = express.Router();
const UserModel = require('../models/userModel');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()

loginUserRouter.use(express.json());

loginUserRouter.post('/', async (req,res) => {
    
    const {email, password} = req.body;

    //check if someone submit blank login form//
    if(!email || !password){
        return res.status(400).json({message: "Please Fill out all the Form Fields"})
    }

    //Check if email ID is valid email or not//
    if(email && !emailValidator.validate(email)) {
        return res.status(422).json({message: "Email ID is Not Valid! Please Use a Valid Email Address"})
    }
    
    // Check if Email ID already exist in MongoDB //
    const user = await UserModel.findOne({email});
    if(!user){
        return res.status(409).json({message: "Email Address Not Found! Please create an Account"})
    }
    
    // Check if password character is more than 6 //
    if(password.length < 6){
        return res.status(422).json({message: "Password need to be atleast 6 or more characters"})
    }

    /**
     * If all the four validation checks, then execute the rest of the code
     * compare the hashed password & email to the Mongo DB
     * and if login success redirect the user to dashboard
     */

    bcrypt.compare(password, user.password, function(err, result) {
        
        if(err){
            return res.status(500).json({message: "Internal Server Error"})
        }
        
        if(!result){
            return res.status(401).json({message: "Invalid Credentials! Password does not macthed"})
        }

        // Create a Cookie variable and store the accessToken in it //
        const expirationTime = new Date(Date.now() + 1 * 60 * 1000); //Cookie variable expires in 1 minutes from now

        //If password and email both matches generate a JWT for accessing the site//
        jwt.sign(
            { 
                userDetails: {
                    userID: user.user_id,
                    fullname: user.fullname,
                    email: user.email 
                } 
            }, // Passwing the payload in JWT
            process.env.PRIVATE_JWT_KEY, // Passing the Secret Key
            function(err, token) { // Callback function for JWT

            if(err) {
                
                console.error();
                res.status(500).json({message: "Internal Server Error. Please Try Again Later"})
            }

            else {

                // Set the accesstoken in a cookie variable
                res.cookie('accessToken', 
                token, // set the varibale and value for access token
                { httpOnly: true, 
                    secure: true, 
                    expires: expirationTime // set the cookie options 
                });
                
                return res.status(200).json(
                    {success_login_message: "Login Successfull. Redirecting to Dashboard in 3 Seconds...", 
                        accessToken: token,
                        userDetails: {
                            user_id: user.user_id,
                            fullname: user.fullname,
                            email: user.email,
                        },
                    }
                )
            }

        });

    });

})



module.exports = loginUserRouter;