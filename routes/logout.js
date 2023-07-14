const express = require('express');
const LogoutRouter = express.Router();

LogoutRouter.post('/', async (req, res)=>{
    res.clearCookie('accessToken');
    res.status(200).json({message: "Logout Successfull!"})
})


module.exports = LogoutRouter;