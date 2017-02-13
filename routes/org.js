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


router.get('/refresh/:content', function(req, res, next){
    var file_name = req.params.content;
    console.log(file_name);
    task.retrieveContent(file_name + '.csv', function (str) {
        var csv = require('csv');
        csv.parse(str, 
            {from : 2, skip_lines_with_empty_values: true}, 
            function(err, data){
                if (file_name === "exercise") {
                    data = processExercise(data);
                } else if (file_name == "pomodora") { 
                    data = processPomodora(data);
                }
                console.log(data);
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


module.exports = router;