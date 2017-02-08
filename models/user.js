var mongoose = require('mongoose');
var Schema = mongoose.Schema;
      

// define the database schema 
var userSchema = new Schema( {
    id: String,
    displayName: String,
    roleLevel: Number 
});

userSchema.static('findOrCreate', function (profile, callback) {
	var userObj = new this();
    this.findOne({id : profile.id}, function(err,result){ 
        if(!result){
        	// not found, create one
            console.log("not found .. create one");
        	userObj.id = profile.id;
            userObj.displayName = profile.displayName;
            userObj.save(callback);
        }else{
        	// found
            console.log("found .. ")
            console.log(result);
            callback(err,result);
        }
    });

});


var User = mongoose.model('User', userSchema);

module.exports = User;