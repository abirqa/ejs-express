const express = require('express');
const SearchCustomerRoute = express.Router();
const CustomerModel = require('../models/customerModel');

SearchCustomerRoute.get('/', async (req, res) => {
    try {
        // Extract adminID from the request
        const adminID = req.query.adminID;

        // Check if adminID is provided and is a valid number
        if (!adminID || isNaN(adminID)) {
            return res.status(400).json({ err_msg: "Please provide a valid adminID parameter" });
        }

        // Convert adminID to a number
        const adminIDNumber = parseInt(adminID, 10);

        // Build a query object based on query parameters (excluding specific fields)
        const query = {
            adminID: adminIDNumber // Use the parsed adminID as a number
        };

        // Define fields that should be excluded from search
        const excludedFields = ['registration_date', 'created_at', 'status', 'business_logo', 'extra_info'];

        // Add additional query parameters for search
        for (const key in req.query) {
            if (!excludedFields.includes(key) && key !== 'adminID') {
                query[key] = new RegExp(`^${req.query[key]}`, 'i');
            }
        }

        // Execute the query
        const queryResult = await CustomerModel.find(query);

        if (queryResult.length === 0) {
            res.status(400).json({ err_msg: "No matching customer data found" });
        } else {
            res.status(200).json({ success_msg: "Customer data Found!!!", customerData: queryResult });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = SearchCustomerRoute;
