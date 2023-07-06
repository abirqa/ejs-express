const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

const app = express();

// Intialize the cookie parser package
app.use(cookieParser());

// Creation of Authentication Middleware of handling JWT //
function auth(req, res, next) {
  
// Get the accesstoken from the browser cookie storage //
const accessToken = req.cookies.accessToken;

// Check if accesstoken is not present in browser cookie, display error //
if (!accessToken) {
    return res.status(401).send("<h2 style='text-align: center; text-transform: capitalize'>You have been logged out from the system due to inactivity! Please Login First.</h2>");
}

// If cookie found, then execute the rest of the code and sign in the respective user //
try {
    // Decode the JWT token and get the user data payload //
    const decoded = jwt.verify(accessToken, process.env.PRIVATE_JWT_KEY);
    
    // console.log('Decoded:', decoded); 
    
    //store the decoded details into a varible with req.user
    req.user = decoded.userDetails;
    
    // console.log('User:', req.user); 
    
    //If succeed with the decode process, forward to next function //
    next(); 

  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = auth;
