const express = require('express');
const AddNewCustomerRoute = express.Router();
const multer = require('multer');
const emailValidator = require('email-validator');
const CustomerModel = require('../models/customerModel');

AddNewCustomerRoute.use(express.json());

// Function to generate a random 4-digit customer ID
function generateCustomerId() {
  const min = 1000;
  const max = 9999;
  const customerId = Math.floor(Math.random() * (max - min + 1) + min).toString();
  return customerId;
}

// Define multer storage with custom filename function
const storage = multer.diskStorage({
  destination: 'uploads/business-logos/',
  filename: function (req, file, callback) {
    const customerId = generateCustomerId();
    const filename = `${customerId}.png`; // Assuming the file will be saved as PNG format
    callback(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }
}).single('business_logo');

AddNewCustomerRoute.post("/:UserID", async (req, res) => {
  try {
    const UserID = req.params.UserID;
    const {
      registration_date,
      business_name,
      customer_name,
      email,
      phone,
      street_address,
      suburb,
      state,
      country,
      pincode,
      status,
      extra_info
    } = req.body;

    // Check if required fields are present in the request body
    if (!registration_date || !business_name || !customer_name || !email || !phone || !street_address || !suburb || !state || !country || !pincode || !status) {
      return res.status(400).json({ message: "Missing required fields in the request body" });
    }

    // Check if given email is valid
    if (email && !emailValidator.validate(email)) {
      return res.status(422).json({ message: "Email ID is Not Valid!. Please Use a Valid Email Address" });
    }

    // Check if Email ID already exists in MongoDB
    const emailExist = await CustomerModel.findOne({ email });
    if (emailExist) {
      return res.status(409).json({ message: "Email ID already Exists! Please use a Different Email" });
    }

    // Generate a random 4-digit User ID
    const customerId = generateCustomerId();

    // Add the Data into MongoDB
    const AddNewCustomer = new CustomerModel({
      customer_id: customerId,
      registration_date,
      business_name,
      customer_name,
      email,
      phone,
      street_address,
      suburb,
      state,
      country,
      pincode,
      status,
      extra_info,
      adminID : UserID,
    });

    const SaveCustomer = await AddNewCustomer.save();
    console.log("Registration Successful", SaveCustomer);

    // Upload the image using multer
    upload(req, res, (err) => {
      if (err) {
        console.log("File upload error:", err);
        return res.status(400).json({ message: "Error uploading file" });
      }

      // Send a response to the client
      res.status(201).json({ message: "Customer registration successful" });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = AddNewCustomerRoute;
