// load all the things we need
var passport = require('passport');
var TwitterStrategy  = require('passport-twitter').Strategy;

var env = require('dotenv');
env.config();

var conn = require('./conn');

module.exports = function(passport) {
    passport.use(new TwitterStrategy({
        consumerKey: process.env.CONSUMER_KEY,
        consumerSecret: process.env.CONSUMER_SECRET,
        callbackURL: process.env.CALLBACK
      },
      function(token, tokenSecret, profile, cb) {
          conn.query(`SELECT id, t_id, token, token_secret, screen_name FROM user WHERE t_id=${profile.id}`, function(err, result){
              if(err){
                console.log(err);
              }else{
                  if(result.length == 1){
                      return cb(null, profile);
                  }else{
                      conn.query(`INSERT INTO user (t_id, token, token_secret, sreen_name) VALUES (${profile.id}, ${token}, ${tokenSecret}, ${profile.screen_name})`, function(err, result){
                          if(err){
                              console.log(err);
                          }else{
                              if(result.affectedRows == 1){
                                  return cb(null, profile);
                              }
                          }
                      })
                  }
              }
          })
        // In this example, the user's Twitter profile is supplied as the user
        // record.  In a production-quality application, the Twitter profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return cb(null, profile);
      }));
    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });
    
    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });
};
