var express = require('express');
var router = express.Router();

var Todos = require('../models/todos');


router.get('/', function(req, res, next) {
	console.log('init todo');
	// retrieve all records from database 
	Todos.find().sort({ sortVal: 'asc' }).exec(function(errs, todos){
		if(errs) {
			console.log(errs);
			console.log('Error in retrieving records');
			res.render('todo', {todos : JSON.stringify([])});
		}
		res.render('todo', {todos : JSON.stringify(todos)});
	});

});


// save the todo 
// at this point the report already exists 
router.post('/save', function(req, res, next) {
        console.log(req.body.name);
        console.log(req.body.value);
	console.log(req.body.pk);

	var key = req.body.pk;
	var id = req.body.name;
	var content = req.body.value;

	Todos.findById(key, function(err, todo){
		if (err) {
			console.log('could not find todo');
		}
		todo.id = id;
		todo.description = content;
		todo.save(function (err) {
  			if (err) {
  				console.log('Error in inputing record');
  			}
  			console.log('record saved');
  			//res.redirect('/todo');
		});
	});

	// res.render('todo', {title : 'okay'}); //this only renders the current page 
	res.end();  // does nothing 
});


// add new todo
router.post('/add', function(req, res, next) {
	var id = req.body.name;
	var content = req.body.value;
	console.log(content);
        
	var todo = new Todos({id: id, description : content, sortVal : 500});
	todo.save(function (err, todo){
		if(err) {
			console.log('Error in creating new record');
		}
		res.json({ _id : todo._id});
	});
	
});




// remove the todo 
router.post('/remove', function(req, res, next) {
	console.log(req.body.pk);
	var key = req.body.pk;
	Todos.remove({ _id: key }, function(err) {
    	if (!err) {
        	console.log('record removed');
    	}
    	else {
           console.log('Error in removing record');
    	}
	});

	res.end();  // does nothing 
});

// reorder the tasks
router.post('/reorder', function(req, res, next){
	var queryString = require('querystring');
	var neworders = queryString.parse(req.body.order)['sort[]'];

	// orginally 
	neworders.forEach(function(key, i ) {
		Todos.findById(key, function(err, todo){
			todo.sortVal = i; 
			todo.save(function (err) {
	  			if (err) {
	  				console.log('Error in inputing record');
	  			}
	  			console.log('record saved');
	  			//res.redirect('/todo');
			});

		});

	});


});

module.exports = router;
