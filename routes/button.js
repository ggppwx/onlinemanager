var express = require('express');
var router = express.Router();

var Buttons = require('../models/buttons');

router.get('/refresh', function (req, res, next) {
    console.log('button refreshed');
    Buttons.find({}, 'event owner', (err, buttons) => {
        res.json(buttons);
    });
});

router.post('/add', function(req, res, next){
    console.log('button added');
    var eventContent = req.body.event

    let ownerid = null;
    if (req.user){
        ownerid = req.user.id;
    }
    // save to database 
    var button = new Buttons({event : eventContent, records : [], owner : ownerid});
    button.save(function (err, button){
        if(err) {
            console.log('Error in creating new record');
        }
        Buttons.find((err, buttons)=>{
            if (err) {
                console.log('Error in finding records');
                return;
            }
            res.json(buttons);
        });
    });
});

router.get('/push/:id', function(req, res, next){
    console.log('button pushed');
    var id = req.params.id
    console.log(id);

    // update the record in database
    Buttons.findById(id, function(err, button){
        if(err){
            console.log('Error in finding record');
            return;
        }
        button.records.push({
            timestamp : new Date(), 
            value: 1
        });
        button.save(function(err, button){
            if(err) {
                console.log('Error in saving record');
                return;
            }
            res.json(button);
        });
    });

});

router.delete('/remove/:id', (req, res) => {
    var id = req.params.id
    console.log(id);
    Buttons.remove({_id : id}, (err, event) => {
        if (err){
            console.log("Error in removing event");
            return;
        }
        Buttons.find((err, buttons) => {
            res.json(buttons);
        });
    });

});



router.get('*', function (req, res, next) {
    res.render('button');
});

module.exports = router;