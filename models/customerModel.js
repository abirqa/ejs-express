const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
    
    adminID: {type: Number, required: false},
    customer_id: {type: Number, required: true},
    registration_date: {type: String},
    business_name: {type: String, required: true},
    customer_name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
    street_address: {type: String, required: true},
    suburb: {type: String, required: true},
    state: {type: String, required: true},
    country: {type: String, required: true},
    pincode: {type: Number, required: true},
    business_logo: {type: String, required: false},
    status: {type: String, required: true},
    extra_info: {type: String, required: true},

    created_at: {type: Date, default: Date.now},
})

const CustomerModel = mongoose.model("CustomerModel", CustomerSchema);

module.exports = CustomerModel;