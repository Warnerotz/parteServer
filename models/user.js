const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    age: String,
    image: String,
    validated: Boolean


}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);