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
                        var retweeted_status = tweet.retweet_status != false ? tweet.retweeted_status.id : 0 ;

                        var query = `INSERT INTO tweets (tw_id, text, id_user, timestamp, retweeted) VALUES (${tweet.id}, ${tweet.text}, ${tweet.user.id}, ${tweet.timestamp}, ${retweeted_status})`;
                        conn.query(query, function(err, result){
                            if(err){
                                console.log(err);
                            }else{
                                if(result.affectedRows == 1){
                                    var query1 = `INSERT INTO tweet_user (twu_id, name, screen_name, url, description, followers_count, friends_count, status_count) VALUES (${tweet.user.id}, ${tweet.user.name}, ${tweet.user.screen_name}, ${tweet.user.url}, ${tweet.user.description}, ${tweet.user.followers_count}, ${tweet.user.friends_count}, ${tweet.user.status_count})`;
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
                                    var query2 = `INSERT INTO retweeted_user (rtu_id, name, screen_name, url, description, followers_count, friends_count, status_count) VALUES (${tweet.retweeted_status.user.id}, ${tweet.retweeted_status.user.name}, ${tweet.retweeted_status.user.screen_name}, ${tweet.retweeted_status.user.url}, ${tweet.retweeted_status.user.description}, ${tweet.retweeted_status.user.followers_count}, ${tweet.retweeted_status.user.friends_count}, ${tweet.retweeted_status.user.status_count})`;
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