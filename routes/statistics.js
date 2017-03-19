var express = require('express');
var router = express.Router();

var Buttons = require('../models/buttons');

router.get('/all', (req, res, next) => {
    console.log('get all statistics');
    Buttons.find({}, (err, buttons) => {
    	var datas = [];
    	for (var i = 0; i < buttons.length; i++) {
    		var event = buttons[i].event;
    		var records = buttons[i].records;

    		var record_map  = {};
    		for (var j = 0; j < records.length; j++) {
    			var timestamp = records[j].timestamp;
    			var value = records[j].value;

    			// construct the map 
    			var acutaldate = timestamp.toDateString();

    			if (acutaldate in record_map){
    				record_map[acutaldate].count += value;
    				record_map[acutaldate].details.push(records[j]);
    			} else {
    				record_map[acutaldate] = {
    					count : value,
    					details : [records[j]]
    				};
    			}
    		}

    		datas.push({event : event, record_map: record_map});
    	}
    	
        res.json(datas);
    });
});


router.get('*', function (req, res, next) {
    res.render('sb_statistics');
});

module.exports = router;