const express = require('express');
const frontendRoutes = express.Router();
const UserDetails = require('../routes/loginUser');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

//Route for Homepage / Login Page
frontendRoutes.get('/', (req, res)=>{
    res.render('index');
});

// Route for Sign Up Page
frontendRoutes.get('/signup', (req, res)=>{
    res.render('signUp');
});

//Route for Forgot Password Page
frontendRoutes.get('/forgotpassword', (req, res)=>{
    res.render('forgotPassword');
});

//Route for Reset Password Page
frontendRoutes.get('/reset-password', (req, res)=>{
    res.render('resetPassword');
});

//Route for Edit Profile Page
frontendRoutes.get('/user-profile', auth, (req, res) => {
    
    //set the accessToken in the cookies at frontend
    const accessToken = req.cookies.accessToken;
    
    // Store the user details in varibale
    const user = req.user; 
    
    res.render('accountSettings', { accessToken, user });
});

// Route for Dashboard
// Get the auth middleware in the route //
frontendRoutes.get('/dashboard', auth, (req, res) => {

// Get the accesstoken in the dashboard route //  
const accessToken = req.cookies.accessToken;

  // Access the authenticated user details via req.user
  const user = req.user; 
  //console.log(user);
  // Render the dashboard page & send the accessToken variable & user variable to dashboard //
  res.render('dashboard', { accessToken, user });

});
  
  
  
  


module.exports = frontendRoutes;