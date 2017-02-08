var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  console.log('in root ------');
  res.render('index', { title: 'Express' , user: req.user});
});

router.get('/logout', function(req, res){
  req.logOut();
  res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {  
  if (req.isAuthenticated())
      return next();
  res.render('index', { title: 'Express' });
}