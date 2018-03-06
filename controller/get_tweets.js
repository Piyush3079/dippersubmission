var conn = require('../routes/conn');

var Twitter = require('twitter');

var conn = require('../routes/conn');

exports.get_tweets = function(req, res){
    var string = req.body.string;
    var id = conn.escape(req.body.id);
    var query = `SELECT token, token_secret FROM user WHERE t_id=${id}`;
    conn.query(query, function(err, result){
        if(err){
            console.log(err);
        }else{
            if(result.length == 1){
                var client = new Twitter({
                    consumer_key: process.env.CONSUMER_KEY,
                    consumer_secret: process.env.CONSUMER_SECRET,
                    access_token_key: result[0].token,
                    access_token_secret: result[0].token_secret
                });
                client.stream('statuses/filter', {track: string},  function(stream) {
                    stream.on('data', function(tweet) {
                        var retweeted_status = tweet.retweeted_status != false ? conn.escape(tweet.retweeted_status.id) : 0 ;

                        var query = `INSERT INTO tweets (tw_id, text, id_user, timestamp, retweeted) VALUES (${conn.escape(tweet.id)}, ${conn.escape(tweet.text)}, ${conn.escape(tweet.user.id)}, ${conn.escape(tweet.timestamp_ms)}, ${retweeted_status})`;
                        conn.query(query, function(err, result){
                            if(err){
                                console.log(err);
                            }else{
                                if(result.affectedRows == 1){
                                    var query1 = `INSERT INTO tweet_user (twu_id, name, screen_name, url, description, followers_count, friends_count, status_count) VALUES (${conn.escape(tweet.user.id)}, ${conn.escape(tweet.user.name)}, ${conn.escape(tweet.user.screen_name)}, ${conn.escape(tweet.user.url)}, ${conn.escape(tweet.user.description)}, ${conn.escape(tweet.user.followers_count)}, ${conn.escape(tweet.user.friends_count)}, ${conn.escape(tweet.user.status_count)})`;
                                    conn.query(query1, function(err, result){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            if(result.affectedRows == 1){
                                                console.log('done');
                                            }else{
                                                console.log('error in tweet_user');
                                            }
                                        }
                                    });
                                    var query2 = `INSERT INTO rtweeted_user (rtu_id, name, screen_name, url, description, followers_count, friends_count, status_count) VALUES (${conn.escape(tweet.retweeted_status.user.id)}, ${conn.escape(tweet.retweeted_status.user.name)}, ${conn.escape(tweet.retweeted_status.user.screen_name)}, ${conn.escape(tweet.retweeted_status.user.url)}, ${conn.escape(tweet.retweeted_status.user.description)}, ${conn.escape(tweet.retweeted_status.user.followers_count)}, ${conn.escape(tweet.retweeted_status.user.friends_count)}, ${conn.escape(tweet.retweeted_status.user.status_count)})`;
                                    conn.query(query2, function(err, result){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            if(result.affectedRows == 1){
                                                console.log('done');
                                            }else{
                                                console.log('Error in retweet user');
                                            }
                                        }
                                    })
                                }else{
                                    console.log('error in tweet');
                                }
                            }
                        });
                    });
                  
                    stream.on('error', function(error) {
                      console.log(error);
                    });
                });
            }
        }
    })
}