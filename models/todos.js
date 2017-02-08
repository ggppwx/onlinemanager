var mongoose = require('mongoose')


var Schema = mongoose.Schema
      

// define the database schema 
var userSchema = new Schema( {
    id: String,
    description: String,
    sortVal: Number,
    owner: String  // owner id 
})

var Todo = mongoose.model('Todo', userSchema);

module.exports = Todo;