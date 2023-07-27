const express = require('express');
const AddNewCustomerRoute = express.Router();
const CustomerModel = require('../models/customerModel')

AddNewCustomerRoute.use(express.json());

AddNewCustomerRoute.post("/", async (req, res) => {
    try {
        const {registration_date, business_name, customer_name, email, phone, street_address, suburb, state, country, pincode, business_logo, status, extra_info} = req.body;
        
    } catch (error) {
        
    }
})








module.exports = AddNewCustomerRoute;