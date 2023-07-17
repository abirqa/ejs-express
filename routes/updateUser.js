const express = require('express');
const multer = require('multer');
const updateUserRouter = express.Router();
const userModel = require('../models/userModel');
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');
const emailValidator = require('email-validator');


updateUserRouter.use(express.json())
//updateUserRouter.use(express.urlencoded({ extended: true }));

updateUserRouter.post('/:userID', async(req, res) => {
    try {
        
        const { userID } = req.params;
        const { fullname, email, userphoto } = req.body;
        console.log(req.body);

        if(!fullname && !email && !userphoto) {
            return res.status(401).json({
                message: "Please provide atleast one data"
            })
        }

        if(email && !emailValidator.validate(email)) {
            return res.status(422).json({
                message: "Email ID is Not Valid!. Please Use a Valid Email Address"
            })
        }
        

        if(userphoto) {

            const base64Data = userphoto;
            const base64Image = base64Data.split(';base64').pop();

            const filename = `uploads/userphoto_${userID}.jpg`;

            await fs.promises.writeFile(filename, base64Image, { encoding: 'base64' });
            await userModel.updateOne({ user_id: userID }, { $set: { profilephoto: filename } });

        }

        if (fullname || email) {
            const updateData = {};
        
            if (fullname) {
              updateData.fullname = fullname;
            }
        
            if (email) {
              updateData.email = email;
            }
        
            await userModel.updateOne({ user_id: userID }, { $set: updateData });

            res.status(200).json({ 
                success_msg: 'Profile Updated Successfully',
                fullname: fullname, 
                email: email, 
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

