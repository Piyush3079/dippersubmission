// load all the things we need
var TwitterStrategy  = require('passport-twitter').Strategy;

var env = require('dotenv');
env.config();

var conn = require('./conn');

module.exports = function(passport) {
    passport.use(new TwitterStrategy({

        consumerKey     : process.env.CONSUMER_KEY,
        consumerSecret  : process.env.CONSUMER_SECRET,
        callbackURL     : process.env.CALLBACK

    }, function(token, tokenSecret, profile, done) {
         console.log(profile.id);
            conn.query(`SELECT id, t_id, token, token_secret FROM user WHERE t_id=${profile.id}`, function(err, result, field){
                if(err){
                    console.log(err);
                    done(err);
                }else{
                    if(result.length == 1){
                        return done(null, result);
                    }else{
                        var id = conn.escape(profile.id);
                        var tok = conn.escape(token);
                        var toksec = conn.escape(tokenSecret);
                        var dpn = conn.escape(profile.displayName);
                        conn.query(`INSERT INTO user (t_id, token, token_secret, screen_name) VALUES (${id}, ${tok}, ${toksec}, ${dpn})`, function(err, result, field){
                            if(err){
                                done(err);
                            }else{
                                if(result.affctedRows == 1){
                                    return done(null, {t_id: profile.id, token: token, tokenSecret: tokenSecret, screen_name: profile.displayName});
                                }
                            }
                        })
                    }
                }
            });
    }));
};
