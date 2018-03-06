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

router.post('/api/query/stream', getTweets.get_tweets_stream);

router.post('/api/query/search', getTweets.get_tweets_search);

router.get('/streams/past', getTweets.past_tweets);

router.get('/streams/all/:init', getTweets.all_tweets);

router.get('/stream/:string/:init', getTweets.tweet_string);

router.get('/user/:id/:user_type', getTweets.tweet_user);

router.get('/users/:table/:init', getTweets.get_all_users);

module.exports = router;
