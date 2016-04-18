var mongoose = require('mongoose')

var Schema = mongoose.Schema
      
// define the database schema 
var userSchema = new Schema( {
    event: String,
    type: String,
    sortVal: Number,
})

var Event = mongoose.model('Event', userSchema);

module.exports = Event;