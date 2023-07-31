const express = require('express');
const GetAllCustomers = express.Router();
const CustomerModel = require('../models/customerModel');

GetAllCustomers.get('/:adminID', async (req, res) => {
    
    try {
        const adminID = req.params.adminID

        const query = await CustomerModel.find({ adminID });

        if(query.length === 0) {
            res.status(500).json({error_msg: "Data not Found on given AdminID"})
        }
        else{
            res.status(200).json({
                data: {
                   sucess_message: `Data Fetched for Admin ID ${adminID}`,
                   results: query,
                }
            })
        }

        
    } catch (error) {
        console.log(error);
        
    }
    

})











module.exports = GetAllCustomers;

