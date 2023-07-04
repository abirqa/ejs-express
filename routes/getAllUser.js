const express = require('express');
const getAllUser = express.Router();
const UserModel = require('../models/userModel');

getAllUser.get('/', async (req, res)=>{
    try{
        const AllUsers = await UserModel.find();
        res.status(201).json({message: "Retreieved Users Lists", UsersList : AllUsers});
    }
    catch{
        console.error(err);
        res.status(501).json({message: "Internal Server Error"});
    }
});

module.exports = getAllUser;