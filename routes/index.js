var express = require('express');
var router = express.Router();

var Twitter  = require('twitter');

var env = require('dotenv');
env.config();

var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET

  });
  client.get('statuses/user_timeline', {screen_name: 'nodejs'}, function(error, tweets, response) {
    if (error) {
      console.log(error);
    }else{
      console.log(tweets);
    }
  });
  res.render('index', { title: 'Express' });
});

router.get('/auth/twitter', passport.authenticate('twitter'));

module.exports = router;
