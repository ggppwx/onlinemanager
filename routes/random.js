var express = require('express');
var router = express.Router();

var Events = require('../models/events');
var LOCAL_EVENTS = [];

router.get('/event', (req, res, next) => {
	// do a random generator 
	Events.find((err, events) => {
		LOCAL_EVENTS = events;
		res.json(events);
	});
});


router.get('/event/random', (req, res, next) => {
	console.log('/random/event/random');
	var len = LOCAL_EVENTS.length;
	// 0 ~ len - 1
	
	if (len != 0) {
		var index = Math.floor(Math.random() * len);
		console.log(index);
		res.json(LOCAL_EVENTS[index]);
	} else {
		res.end();
	}	
	
	res.end();
});

router.post('/event/add', (req, res, next) => {
	console.log('/random/event/add');
	console.log(req.body.event);
	// go to database 
	var event = new Events({event : req.body.event});
	event.save(function (err, event){
		if(err) {
			console.log('Error in creating new record');
		}
		Events.find((err, events)=>{
			if (err) {
				console.log('Error in finding records');
			}
			LOCAL_EVENTS = events;
			res.json(events);
		});
	});
});



router.delete('/event/:id', (req, res) => {
	console.log(req.params.id);
	
	Events.remove({_id : req.params.id}, (err, event) => {
		if (err){
			console.log("Error in removing event");
		}

		Events.find((err, events) => {
			if (err) {
				console.log('Error in finding records');
			}
			LOCAL_EVENTS = events;
			res.json(events);
		});
		
	});

});


router.get('*', (req, res) => {
	res.render('random',{});
});



module.exports = router;