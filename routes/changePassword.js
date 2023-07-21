const express = require('express');
const app = express();
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const changePasswordRouter = express.Router();

changePasswordRouter.use(express.json());

changePasswordRouter.post('/:userID', async (req, res) => {
    
    try {

        const { userID } = req.params;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Check if the three form fields are blank //
        if(!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(401).send({
                data: {
                    message: "Please fill out all the fields",
                }
            })
        }

        if(oldPassword.length < 6 ) {
            return res.status(403).send({
                data: {
                    message: "Old Password needs to be atleast 6 Characters long",
                }
            })
        }

        // Get the user from the User ID//
        const user = await UserModel.findOne({user_id:userID});

        // Check if User Entered Old Password matches in existing mongo db //
        const matchOldPassword = await bcrypt.compare(oldPassword, user.password);

        if(!matchOldPassword) {
            return res.status(401).send({
                data: {
                    message: "Old Password Doesn't Matched. Try Again",
                }
            })
        }
        
        // Check if New & Confirm New Password characters are more than 6 //
        if(newPassword.length < 6 ) {
            return res.status(403).send({
                data: {
                    message: "New Password needs to be atleast 6 Characters long",
                }
            })
        }

        if(confirmNewPassword.length < 6 ) {
            return res.status(403).send({
                data: {
                    message: "Confirm New Password needs to be atleast 6 Characters long",
                }
            })
        }

        // Check if New Password & Confirm New password both are same //
        if(newPassword !== confirmNewPassword) {
            return res.status(403).send({
                data: {
                    message: "New Password & Confirm New Password Needs to be same",
                }
            })
        }

        // hash the new password which user is setting and update mongo db with new pwd //
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await UserModel.updateOne(
                {
                    user_id : userID,
                },
                {
                    $set: {
                        password : hashedNewPassword,
                    },
                }
            );

            return res.status(200).json({
                data: {
                    success_msg : "New Password has been Updated!"
                }
            })
        
    } catch (error) {

        console.log(error);
        
    }
})


module.exports = changePasswordRouter;