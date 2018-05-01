//public id: string,
//public nombre: string,
//public fecha_creacion: Date
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ListSchema = Schema({
    name: String,
    media: [{
        name: String,
        path: String,
        size: String,
        fellow: String
    }]


}, { timestamps: true });

module.exports = mongoose.model('List', ListSchema);