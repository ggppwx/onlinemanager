var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Records = new Schema({
    timestamp: Date,
    value: Number
});


// define the database schema 
var userSchema = new Schema( {
    event: String,
    records:[Records],
    owner: String  // owner id 
});

var Button = mongoose.model('Button', userSchema);

module.exports = Button;