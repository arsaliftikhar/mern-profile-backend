const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    user_name: String,
    email: String,
    password: String,
    verification_code: String
})


const UserModal = mongoose.model("users",UserSchema)

module.exports = UserModal