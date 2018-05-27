var express = require('express');
var router = express.Router();
var fs = require('fs');
var config = require('config');

router.get('/', function(req, res, next) {
    var dropbox_path = config.get('Dropbox.path');
    var file_path = dropbox_path + '/leetcode/' + 'map.html';
    fs.readFile(file_path, (err, data) => {
        if (err) throw err;

        res.render(
            'code',
            {
                codeHtml: data
            }
        );
    });
});



module.exports = router;
