var express = require('express');
var router = express.Router();

var task = require('../tasks/tasks');

router.get('/', function(req, res, next) {
	console.log('org ..');

	var processAgendaFile = function (str) {
		console.log('processing file');
		res.render('org', {agendaHtml: str});

	};

	task.retrieveContent('agenda.html', processAgendaFile)



});

module.exports = router;