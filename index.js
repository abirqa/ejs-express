const express = require('express');
const port = process.env.port || 5000;
const frontendRoutes = require('./routes/frontendRoutes');

// Initialiaze Express App//
const app = express();

//Set the View Engine to EJS//
app.set("view engine", 'ejs');








//Frontend EJS Templates routes//
app.use('/', frontendRoutes);
app.use('/signup', frontendRoutes);
app.use('/forgotpassword', frontendRoutes);
app.use('/dashboard', frontendRoutes);



app.listen(port, (req, res)=>{
    console.log(`Backend Server Running at ${port}`);
})
