const express = require('express');
const AddNewCustomerRoute = express.Router();
const multer = require('multer');
const emailValidator = require('email-validator');
const CustomerModel = require('../models/customerModel');
const upload = multer({ dest: 'uploads/business-logos/', limits: { fileSize: 1024 * 1024 * 10 } })
const fs = require('fs');


//set the file upload limit to 10mb//
AddNewCustomerRoute.use(express.json({ limit: '10mb' }));
AddNewCustomerRoute.use(express.urlencoded({ extended: true, limit: '10mb' }));

AddNewCustomerRoute.post('/:UserID', async (req, res) => {

  try {
    const { UserID } = req.params;
    
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
      business_logo, 
      status, 
      extra_info 
    } = req.body;

    console.log(req.body);

    // Lets check if any of the fields are blank or not //
    if (!registration_date || !business_name || !customer_name || !email || !phone || !street_address || !suburb || !state || !country || !pincode || !status) {
      return res.status(400).json({ error_msg: "Please fill the Required Fields!" })
    }

    // Check if the business name exist in the db //
    const checkBusinessName = await CustomerModel.findOne({ business_name: business_name });
    if (checkBusinessName) {
      return res.status(401).json({ error_msg: "Business Name Already Exists in the Database!" });
    }

    // Check if the email is validate or not //
    if (email && !emailValidator.validate(email)) {
      return res.status(422).json({ error_msg: "Email ID is Not Valid!. Please Use a Valid Email Address" })
    }

    // Check if the business name exist in the db //
    const checkEmailID = await CustomerModel.findOne({ email: email });
    if (checkEmailID) {
      return res.status(401).json({ error_msg: "Business Email Already Exists in the Database!" });
    }

    // Generate a random 4 Digit User ID //
    function generateCustomerId() {
      const min = 1000;
      const max = 9999;

      const CustomerId = Math.floor(Math.random() * (max - min + 1) + min).toString();

      return CustomerId;
    }

    // Generate the customerId
    const customerId = generateCustomerId();

    // Check if business_logo is there
    if (business_logo) {
      const base64Data = business_logo;
      const base64Image = base64Data.split(';base64').pop();

      const filename = `uploads/business-logos/BusinessLogo_${customerId}.jpg`;

      await fs.promises.writeFile(filename, base64Image, { encoding: 'base64' });

      // Save the data to MongoDB
      const newCustomer = new CustomerModel({
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
        adminID: UserID,
        business_logo: filename // Save the path of the uploaded image
      });

      await newCustomer.save();

      return res.status(200).json({ success_message: "Customer registration successful" });
    }

     // If business_logo is not present, save the data without the image
     const newCustomer = new CustomerModel({
      customer_id: generateCustomerId(),
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
      adminID: UserID,
    });

    await newCustomer.save();

    return res.status(200).json({success_message: "Customer registration successful" });

  } catch (error) {
    res.status(500).json({error_msg: "Internal Server Error! Please Try Again Later"});
    console.log(error);
  }

})

module.exports = AddNewCustomerRoute;
