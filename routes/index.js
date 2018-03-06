var express = require('express');
var router = express.Router();

var Twitter  = require('twitter');

var env = require('dotenv');
env.config();

var passport = require('passport');

var getTweets = require('../controller/get_tweets');

// Define routes.
router.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

router.get('/login/twitter',
  passport.authenticate('twitter'));

router.get('/api/callback', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

router.post('/api/query', getTweets.get_tweets);

router.get('/streams/past', getTweets.past_tweets);

module.exports = router;
