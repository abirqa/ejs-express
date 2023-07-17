const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profilephoto: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
})

const UserModel = mongoose.model("UserModel", UserSchema);

module.exports = UserModel;