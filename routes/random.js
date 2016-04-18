var express = require('express');
var router = express.Router();

var Events = require('../models/events');

var events = [];


router.get('/event', (req, res, next) => {
	// do a random generator 
	res.json(events);
});


router.get('/event/random', (req, res, next) => {
	console.log('/random/event/random');
	var len = events.length;
	// 0 ~ len - 1
	
	if (len != 0) {
		var index = Math.floor(Math.random() * len);
		console.log(index);
		res.json(events[index]);
	} else {
		res.end();
	}	
	
	res.end();
});


router.post('/event/add', (req, res, next) => {
	console.log('/random/event/add');
	console.log(req.body.event);
	// go to database 
	events.push({event : req.body.event, type: 'game'});
	res.json(events);
});



router.get('/event/delete', (req, res) => {
	console.log(req.query);
	res.end();
});


router.get('*', (req, res) => {
	res.render('random',{});
});



module.exports = router;