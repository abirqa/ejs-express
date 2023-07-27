const express = require('express');
const RegisterUserRouter = express.Router();
const UserModel = require('../models/userModel');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

const saltRounds = 10;

RegisterUserRouter.use(express.json());

RegisterUserRouter.post('/', async (req, res)=>{
    
    try{
        const {fullname, email, password, ConfirmPassword} = req.body;

        // Validation Check if Form fields were blank //
        if(!fullname || !email || !password){
            return res.status(400).json({message: "Please Fill out all the Form Fields"})
        }

        //Check if email ID is valid email or not//
        if(email && !emailValidator.validate(email)) {
            return res.status(422).json({message: "Email ID is Not Valid!. Please Use a Valid Email Address"})
        }
        
        // Check if Email ID already exist in MongoDB //
        const emailExist = await UserModel.findOne({email});
        if(emailExist){
            return res.status(409).json({message: "Email ID already Exists! Please use a Different Email"})
        }
        
        // Check if password character is more than 6 //
        if(password.length < 6){
            return res.status(422).json({message: "Password need to be atleast 6 or more characters"})
        }
        
        // Check if password is equal to confirm password //
        if(password !== ConfirmPassword){
            return res.status(422).json({message: "Password and Confirm Password does not match. Please Check"})
        }
        
        // Generate a random 4 Digit User ID //
        function generateUserId() {
            const min = 1000;
            const max = 9999;
          
            const userId = Math.floor(Math.random() * (max - min + 1) + min).toString();
          
            return userId;
        }

        /** If all the above 5 validation succeeds, execute the rest of the code */
        /**
         * Then hash the user typed password
         * and sends the data to MongoDB
         */
        bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
            if(err){
                throw err;
            }
            else{
                const newUser = new UserModel({ user_id: generateUserId(), fullname, email, password: hashedPassword });
                const SavedUser = await newUser.save();
                console.log("New Registration Successfull")
                res.status(201).json({success_message: "New User Registered Successfully", user:SavedUser})
            }

        });
    }
    catch{
        console.error();
        console.log("Error While New Registration")
        res.status(501).json({message: "API Endpoint Not Working"})
    }    
});

module.exports = RegisterUserRouter;

