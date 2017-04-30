var express = require('express');
var router = express.Router();

var Events = require('../models/events');
var LOCAL_EVENTS_MAP = {};


var saveEventsOnTags = function(events){
	var eventsMap = {};
	for (var i = 0 ; i < events.length; ++i) {
		if (events[i].tags) {
			for( var j = 0; j < events[i].tags.length; ++j ) {
				if (events[i].tags[j] in eventsMap){
					eventsMap[events[i].tags[j]].push(events[i]);
				} else {
					eventsMap[events[i].tags[j]] = [ events[i] ];
				}
			}
		}
	}
	eventsMap['All'] = events;
	// console.log(eventsMap);
	return eventsMap;
};

router.get('/event', (req, res, next) => {
	// do a random generator
	Events.find((err, events) => {
		LOCAL_EVENTS_MAP = saveEventsOnTags(events);
		res.json(events);
	});
});


router.post('/event/random', (req, res, next) => {
	console.log('/random/event/random');
	console.log(req.body.tag);
	var tag = req.body.tag;

	// based on tag, random a event
	if (!(tag in LOCAL_EVENTS_MAP)) {
		res.json({});
		return;
	}

	var len = LOCAL_EVENTS_MAP[tag].length;
	// 0 ~ len - 1

	if (len !== 0) {
		var index = Math.floor(Math.random() * len);
		console.log(index);
		var event = LOCAL_EVENTS_MAP[tag][index];

		res.json(event);
	} else {
		res.end();
	}

	res.end();
});

router.post('/event/add', (req, res, next) => {
	console.log('/random/event/add');
	var eventContent = req.body.event

	function processEvent(content){
		// process the string
		var pattern = /#\S+/g;
		var hashtags = content.match(pattern);
		var content = content.replace(pattern,"");
		return { hashtags : hashtags, content : content } ;
	}
	// parse the event.
	// get the event + tags
    var  eventObj = processEvent(eventContent);
    console.log(eventObj);

	// go to database
	var event = new Events({event : eventObj.content, tags: eventObj.hashtags});
	event.save(function (err, event){
		if(err) {
			console.log('Error in creating new record');
		}
		Events.find((err, events)=>{
			if (err) {
				console.log('Error in finding records');
			}
			LOCAL_EVENTS_MAP = saveEventsOnTags(events);
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
			LOCAL_EVENTS_MAP = saveEventsOnTags(events);
			res.json(events);
		});

	});

});


router.get('*', (req, res) => {
	res.render('random',{user: req.user});
});



module.exports = router;
