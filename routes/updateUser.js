const express = require('express');
const multer = require('multer');
const updateUserRouter = express.Router();
const userModel = require('../models/userModel');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 1024 * 1024 * 10 } })
const fs = require('fs');
const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');

//set the file upload limit to 10mb//
updateUserRouter.use(express.json({ limit: '10mb' }));
updateUserRouter.use(express.urlencoded({ extended: true, limit: '10mb' }));

updateUserRouter.post('/:userID', async(req, res) => {
    try {
        
        //get the userid//
        const { userID } = req.params;
        //get the form data//
        const { fullname, email, userphoto } = req.body;
        //console.log(req.body);

        // Checks if fields are not blank //
        if(!fullname && !email && !userphoto) {
            return res.status(401).json({
                message: "Please provide atleast one data"
            })
        }

        //check if email was valid or not//
        if(email && !emailValidator.validate(email)) {
            return res.status(422).json({
                message: "Email ID is Not Valid!. Please Use a Valid Email Address"
            })
        }
        
        // Check if userphoto is their//
        if(userphoto) {

            // Save the userphoto base64 string which is coming from frontend, store in varibale
            const base64Data = userphoto;
            //Convert the base64 string into base64 Image with split and pop function//
            const base64Image = base64Data.split(';base64').pop();

            //Create a custom structure filename, which includes user_id//
            const filename = `uploads/userphoto_${userID}.jpg`;

            //read the file from uploads folder using filesystem//
            await fs.promises.writeFile(filename, base64Image, { encoding: 'base64' });
            
            //Update the image in mongo db//
            await userModel.updateOne({ user_id: userID }, { $set: { profilephoto: filename } });

        }

        //Check if there is email or fullname//
        if (fullname || email) {
            //If anyof them is present, create a blank object
            const updateData = {};
        
            // if fullname present, update fullname
            if (fullname) {
              updateData.fullname = fullname;
            }
        
            // if email present, update email
            if (email) {
              updateData.email = email;
            }
        
            // Update the data in Mongo DB//
            await userModel.updateOne({ user_id: userID }, { $set: updateData });

            // Fetch the updated user data from the database
            const updatedUser = await userModel.findOne({ user_id: userID });

             // Update the user details in the JWT payload
            const updatedToken = jwt.sign(
                {
                userDetails: {
                    userID: updatedUser.user_id,
                    fullname: updatedUser.fullname,
                    email: updatedUser.email,
                    userphoto: updatedUser.profilephoto,
                },
                },
                process.env.PRIVATE_JWT_KEY,
                { expiresIn: '2m' } // Set the expiration time if needed
            );
        
            // Send the updated token in the response
            res.cookie('accessToken', updatedToken, { httpOnly: true, secure: true });

            res.status(200).json({ 
                success_msg: 'Profile Updated Successfully',
                fullname: updatedUser.fullname, 
                email: updatedUser.email, 
                userphoto: updatedUser.profilephoto,
            });
        }
        
        else { 
            console.log(error);
            res.status(500).json({message: "Internal Server Error, Profile cannot be updated now!"});
        }
             
    } catch (error) {
        console.log(error);
        res.json({message: `Internal Error: ${error}`})
    }
})


module.exports = updateUserRouter;

