const express = require('express');
const frontendRoutes = express.Router();

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

//Route for Dashboard
frontendRoutes.get('/dashboard', (req, res)=>{
    res.render('dashboard');
});


module.exports = frontendRoutes;