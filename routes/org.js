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

    task.retrieveContent('agenda.html', processAgendaFile);



});


router.get('/refresh/agenda', function(req, res, next) {
    task.retrieveContent('csv/agenda.csv', function (str) {
        var csv = require('csv');
        csv.parse(str, 
            {from : 1, skip_lines_with_empty_values: true}, 
            function(err, data){
                data = processAgenda(data);
                res.json({ 
                    data: data
                });
            }); 
    });

});


router.get('/refresh/exercise', function(req, res, next) {
    task.retrieveContent('csv/exercise.csv', function (str) {
        var csv = require('csv');
        csv.parse(str, 
            {from : 2, skip_lines_with_empty_values: true}, 
            function(err, data){
                data = processExercise(data);
                res.json({ 
                    data: data
                });
            }); 
    });

});

router.get('/refresh/pomodora', function(req, res, next) {
    task.retrieveContent('csv/pomodora.csv', function (str) {
        var csv = require('csv');
        csv.parse(str, 
            {from : 2, skip_lines_with_empty_values: true}, 
            function(err, data){
                data = processPomodora(data);
                res.json({ 
                    data: data
                });
            }); 
    });

});

function processExercise(data){
    var datas = [];
    for (var i = 0; i < data.length; ++i) {
        datas.push([data[i][0], data[i][1].length]);
    }
    return datas;
}

function processPomodora(data) {
    var datamap = {};
    for (var i = 0; i < data.length; ++i) {
        if (data[i][0] in datamap) {
            datamap[data[i][0]] += data[i][2].length/3;
        } else {
            datamap[data[i][0]] = data[i][2].length/3;
        }
    }
    var result = [];
    for (var obj in datamap) {
        result.push([obj, datamap[obj]]);
    }
    return result;
}

function processAgenda(data) {
    var result = [];
    for (var i = 0; i < data.length; ++i) {
        var d = data[i];
        //($category,$head,$type,$todo,$tags,$date,$time,$extra,
        // $priority_l,$priority_n)
        result.push({
            category : d[0],
            head: d[1],
            type: d[2],
            todo: d[3],
            tags: d[4],
            date: d[5],
            time: d[6],
            extra: d[7],
            priority_l: d[8],
            priority_n: d[9]
        });
    }
    return result;
}


module.exports = router;
