const express = require('express');
const port = process.env.port || 5000;

// Initialiaze Express App//
const app = express();

//Set the View Engine to EJS//
app.set("view engine", 'ejs');

app.get('/', (req, res)=>{
    res.render('index')
});

app.listen(port, (req, res)=>{
    console.log(`Backend Server Running at ${port}`);
})
