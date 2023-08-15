const express = require('express');
const GetAllCustomers = express.Router();
const CustomerModel = require('../models/customerModel');

GetAllCustomers.get('/:adminID', async (req, res) => {
    try {
        const adminID = req.params.adminID;
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10; // Number of records per page

        const totalCount = await CustomerModel.countDocuments({ adminID });
        const totalPages = Math.ceil(totalCount / pageSize);

        const query = await CustomerModel.find({ adminID })
            .sort({ registration_date: -1 }) // Sorting by registration_date in descending order
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        if (query.length === 0) {
            res.status(500).json({ error_msg: "Data not Found on given AdminID" });
        } else {
            res.status(200).json({
                data: {
                    success_message: `Data Fetched for Admin ID ${adminID}`,
                    results: query,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        pageSize: pageSize,
                        totalCount: totalCount
                    }
                }
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error_msg: "An error occurred while fetching data" });
    }
});

module.exports = GetAllCustomers;
