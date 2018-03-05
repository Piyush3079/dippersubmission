// load all the things we need
var passport = require('passport');
var TwitterStrategy  = require('passport-twitter').Strategy;

var env = require('dotenv');
env.config();

var conn = require('./conn');

module.exports = function(passport) {
    passport.use(new TwitterStrategy({
        consumerKey: 'WtZqMRCVZk90Qxr5FgujWwoz2',
        consumerSecret: 'f1mcTfOv1FrMjnhTwSEX1L4AbL4g9MS7y26MQI5cG9x8kRRBrv',
        callbackURL: 'http://127.0.0.1:3000/api/callback'
      },
      function(token, tokenSecret, profile, cb) {
        // In this example, the user's Twitter profile is supplied as the user
        // record.  In a production-quality application, the Twitter profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return cb(null, profile);
      }));
    // passport.use(new TwitterStrategy({

    //     consumerKey     : process.env.CONSUMER_KEY,
    //     consumerSecret  : process.env.CONSUMER_SECRET,
    //     callbackURL     : process.env.CALLBACK

    // }, function(token, tokenSecret, profile, done) {
    //      console.log(profile.id);
    //         conn.query(`SELECT id, t_id, token, token_secret FROM user WHERE t_id=${profile.id}`, function(err, result, field){
    //             if(err){
    //                 console.log(err);
    //                 done(err);
    //             }else{
    //                 if(result.length == 1){
    //                     return done(null, result);
    //                 }else{
    //                     var id = conn.escape(profile.id);
    //                     var tok = conn.escape(token);
    //                     var toksec = conn.escape(tokenSecret);
    //                     var dpn = conn.escape(profile.displayName);
    //                     conn.query(`INSERT INTO user (t_id, token, token_secret, screen_name) VALUES (${id}, ${tok}, ${toksec}, ${dpn})`, function(err, result, field){
    //                         if(err){
    //                             done(err);
    //                         }else{
    //                             if(result.affctedRows == 1){
    //                                 return done(null, {t_id: profile.id, token: token, tokenSecret: tokenSecret, screen_name: profile.displayName});
    //                             }
    //                         }
    //                     })
    //                 }
    //             }
    //         });
    // }));
    passport.serializeUser(function(user, cb) {
    cb(null, user);
    });
    
    passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
    });
};
