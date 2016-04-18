var express = require('express');
var router = express.Router();


/* GET calendar home page. */
router.get('/', function(req, res, next) {
    // recursive(nextID, 0);
    res.render('calendar', {});
});


module.exports = router