var express = require('express');
var router = express.Router();

var Twitter  = require('twitter');

var env = require('dotenv');
env.config();

var passport = require('passport');

// Define routes.
router.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

router.get('/login/twitter',
  passport.authenticate('twitter'));

router.get('/api/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

module.exports = router;
