var express = require('express');
var router = express.Router();

var task = require('../tasks/tasks');

router.get('/', function(req, res, next) {
    console.log('org ..');

    var processAgendaFile = function (str) {
        console.log('processing file');
        res.render('org', 
        {
            agendaHtml: str
        });

    };

    task.retrieveContent('agenda.html', processAgendaFile)



});


router.get('/refresh', function(req, res, next){

    task.retrieveContent('exercise.csv', function (str) {
        var csv = require('csv');
        csv.parse(str, 
            {from : 2, skip_lines_with_empty_values: true}, 
            function(err, data){
                for (var i = 0; i < data.length; ++i) {
                    data[i][1] = data[i][1].length;
                }
                console.log(data);
                res.json({ 
                    exerciseData: data
                });
            }); 
    });


});

module.exports = router;