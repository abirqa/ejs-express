const express = require('express');
const GetCustomerDetails = express.Router();
const CustomerModel = require('../models/customerModel');

GetCustomerDetails.get('/', async (req, res) => {
    try {
       const adminID = req.query.adminID;
       const customerID = req.query.customer_id;

       const query = await CustomerModel.findOne({adminID : adminID, customer_id : customerID});

       if(!query){
        res.status(404).json({error_msg: "Data Not Found on given Admin ID or Customer ID"})
       }
       else{
        res.status(200).json({
            data: {
                success_msg: `Single Customer Data Feteched for Admin ID ${adminID} and CustomerID ${customerID}`,
                results: query
            }
        })
       }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error_msg: "An error occurred while fetching data" });
    }
});

module.exports = GetCustomerDetails;
