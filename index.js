const express = require('express');
const port = process.env.port || 5000;
const frontendRoutes = require('./routes/frontendRoutes');
const dbConfig = require('./config/dbConfig');
const RegisterUserRouter = require('./routes/createUser');
const getAllUser = require('./routes/getAllUser');

// Initialiaze Express App//
const app = express();

//Set the View Engine to EJS//
app.set("view engine", 'ejs');

//parse the client side data into formData//
// app.use(express.urlencoded({ extended: true }));


// Backend API Routes //
app.use('/api/v1/RegisterUser', RegisterUserRouter);
app.use('/api/v1/users', getAllUser);




//Frontend EJS Templates routes//
app.use('/', frontendRoutes);
app.use('/signup', frontendRoutes);
app.use('/forgotpassword', frontendRoutes);
app.use('/dashboard', frontendRoutes);



app.listen(port, (req, res)=>{
    console.log(`Backend Server Running at ${port}`);
})
