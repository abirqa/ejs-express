const express = require('express');
const cors = require('cors');
const port = process.env.port || 8000;
const path = require('path');
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
const changePasswordRouter = require('./routes/changePassword');
const AddNewCustomerRoute = require('./routes/AddNewCustomer');
const GetAllCustomers = require('./routes/getAllCustomers');


// Initialiaze Express App//
const app = express();

app.use(cors());

app.use(cookieParser());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Set the View Engine to EJS//
app.set("view engine", 'ejs');

//parse the client side data into formData//
// app.use(express.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());


// Backend API Routes //
app.use('/api/v1/RegisterUser', RegisterUserRouter);
app.use('/api/v1/users', getAllUser);
app.use('/api/v1/LoginUser', loginUserRouter);
app.use('/api/v1/ForgotPassword', ForgotPasswordRouter);
app.use('/api/v1/reset-password', ResetPasswordRouter);
app.use('/api/v1/logout', LogoutRouter);
app.use('/api/v1/UpdateUser', updateUserRouter);
app.use('/api/v1/changePassword', changePasswordRouter);
app.use('/api/v1/AddNewCustomer', AddNewCustomerRoute);
app.use('/api/v1/GetAllCustomers', GetAllCustomers);

//Frontend EJS Templates routes//
app.use('/', frontendRoutes);
app.use('/signup', frontendRoutes);
app.use('/forgotpassword', frontendRoutes);
app.use('/dashboard', frontendRoutes);
// app.use('/change-password', frontendRoutes);


app.listen(port, (req, res)=>{
    console.log(`Backend Server Running at ${port}`);
})
