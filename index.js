const express = require('express');
const port = process.env.port || 5000;
const frontendRoutes = require('./routes/frontendRoutes');
const dbConfig = require('./config/dbConfig');
const RegisterUserRouter = require('./routes/createUser');
const getAllUser = require('./routes/getAllUser');
const loginUserRouter = require('./routes/loginUser');
const ForgotPasswordRouter = require('./routes/forgotPassword');
const ResetPasswordRouter = require('./routes/resetPassword');
const LogoutRouter = require('./routes/logout');
const updateUserRouter = require('./routes/updateUser');
const cookieParser = require('cookie-parser')

// Initialiaze Express App//
const app = express();

app.use(cookieParser());


//Set the View Engine to EJS//
app.set("view engine", 'ejs');

//parse the client side data into formData//
// app.use(express.urlencoded({ extended: true }));


// Backend API Routes //
app.use('/api/v1/RegisterUser', RegisterUserRouter);
app.use('/api/v1/users', getAllUser);
app.use('/api/v1/LoginUser', loginUserRouter);
app.use('/api/v1/ForgotPassword', ForgotPasswordRouter);
app.use('/api/v1/reset-password', ResetPasswordRouter);
app.use('/api/v1/logout', LogoutRouter);
app.use('/api/v1/UpdateUser', updateUserRouter)

//Frontend EJS Templates routes//
app.use('/', frontendRoutes);
app.use('/signup', frontendRoutes);
app.use('/forgotpassword', frontendRoutes);
app.use('/dashboard', frontendRoutes);



app.listen(port, (req, res)=>{
    console.log(`Backend Server Running at ${port}`);
})
