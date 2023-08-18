const express = require('express');
const DeleteCustomer = express.Router();
const CustomerModel = require('../models/customerModel');

DeleteCustomer.delete('/', async (req, res) => {
    try {

        const customer_id = req.query.customer_id

        // Check customer id is available //
        const customer_id_query = await CustomerModel.findOne({customer_id : customer_id});

        if(!customer_id_query){
            res.status(404).json({error_msg: "Customer ID Not Found"});
        }
        
        // If Customer id is present delete the data //
        else {

            const query = await CustomerModel.deleteOne({customer_id : customer_id});

            if(!query) {
                res.status(500).json({error_msg: "Internal Server Error"})
            }
            else{
                res.status(200).json({success_msg: "Customer Record Deleted Successfully"});
            }
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error_msg: "An error occurred while fetching data" , error});
    }
});

module.exports = DeleteCustomer;
