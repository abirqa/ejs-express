const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
    customer_id: {type: Number, required: true},
    businessname: {type: String, required: true},
    customername: {type: String, required: true},
    email: {type: String, required: true},
    phonenumber: {type: String, required: true},
    streetaddress: {type: String, required: true},
    suburb: {type: String, required: true},
    state: {type: String, required: true},
    country: {type: String, required: true},
    pincode: {type: String, required: true},
    businesslogo: {type: String, required: true},
    status: {type: String, required: true},
    extrainfo: {type: String, required: true},

    created_at: {type: Date, default: Date.now},
})

const CustomerModel = mongoose.model("CustomerModel", CustomerSchema);

module.exports = CustomerModel;