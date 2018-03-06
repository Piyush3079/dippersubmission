var conn = require('../routes/conn');

var Twitter = require('twitter');

var conn = require('../routes/conn');

exports.get_tweets_stream = function(req, res){
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
                var query_string = `INSERT INTO query (user_id, string) VALUES (${id}, ${conn.escape(string)})`;
                        conn.query(query_string, function(err, result){
                            if(err){
                                console.log(err);
                            }else{
                                if(result.affectedRows == 1){
                                    console.log('done');
                                }else{
                                    console.log('error in entring string in database');
                                }
                            }
                        });
                client.stream('statuses/filter', {track: string},  function(stream) {
                    stream.on('data', function(tweet) {
                        var retweeted_status = tweet.retweeted_status != false ? conn.escape(tweet.retweeted_status ? tweet.retweeted_status.id ? tweet.retweeted_status.id : 0 :0) : 0 ;
                        var query = `INSERT INTO tweets (tw_id, text, id_user, timestamp, retweeted, string) VALUES (${conn.escape(tweet.id)}, ${conn.escape(tweet.text)}, ${conn.escape(tweet.user.id)}, ${conn.escape(tweet.timestamp_ms)}, ${retweeted_status}, ${conn.escape(string)})`;
                        conn.query(query, function(err, result){
                            if(err){
                                console.log(err);
                            }else{
                                if(result.affectedRows == 1){
                                    var query1 = `INSERT INTO tweet_user (twu_id, name, screen_name, url, followers_count, friends_count, status_count) VALUES (${conn.escape(tweet.user.id)}, ${conn.escape(tweet.user.name)}, ${conn.escape(tweet.user.screen_name)}, ${conn.escape(tweet.user.url)}, ${conn.escape(tweet.user.followers_count)}, ${conn.escape(tweet.user.friends_count)}, ${conn.escape(tweet.user.status_count)})`;
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
                                    if(tweet.retweeted_status){
                                        if(tweet.retweeted_status.user){
                                            var query2 = `INSERT INTO rtweeted_user (rtu_id, name, screen_name, url, followers_count, friends_count, status_count) VALUES (${conn.escape(tweet.retweeted_status.user.id)}, ${conn.escape(tweet.retweeted_status.user.name)}, ${conn.escape(tweet.retweeted_status.user.screen_name)}, ${conn.escape(tweet.retweeted_status.user.url)}, ${conn.escape(tweet.retweeted_status.user.followers_count)}, ${conn.escape(tweet.retweeted_status.user.friends_count)}, ${conn.escape(tweet.retweeted_status.user.status_count)})`;
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
                                            });
                                        }
                                    }
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

exports.get_tweets_search = function(req, res){
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
                var query_string = `INSERT INTO query (user_id, string) VALUES (${id}, ${conn.escape(string)})`;
                        conn.query(query_string, function(err, result){
                            if(err){
                                console.log(err);
                            }else{
                                if(result.affectedRows == 1){
                                    console.log('done');
                                }else{
                                    console.log('error in entring string in database');
                                }
                            }
                        });
                        client.get('search/tweets', {q: string, result_type: 'popular'}, function(error, tweets, response) {
                            console.log(tweets);
                         });
            }
        }
    })
}

exports.past_tweets = function(req, res){
    var query = `SELECT query.id, query.user_id, query.string, query.created_at, user.screen_name FROM query, user WHERE query.user_id=user.t_id`;
    conn.query(query, function(err, result){
        if(err){
            console.log(err);
        }else{
            res.render('past_streams', {stream: result});
        }
    });
}

exports.tweet_string = function(req, res){
    var string = conn.escape(req.params.string);
    var init = Number(req.params.init)*100;
    var query = `SELECT * FROM tweets WHERE string=${string} AND id>${init} LIMIT 100`;
    console.log(query);
    conn.query(query, function(err, result0){
        if(err){
            console.log(err);
        }else{
            conn.query(`SELECT COUNT(*) AS count FROM tweets WHERE string=${string}`, function(err, result){
                if(err){
                    console.log(err);
                }else{
                    res.render('stream_string', {stream: result0, count: result, id: init, string: req.params.string, url: 'stream'});
                }
            })
        }
    })
}

exports.tweet_user = function(req, res){
    var id = req.params.id;
    var user_type = req.params.user_type;
    if(user_type == 0){
        var user_id = 'twu_id';
        var table = 'tweet_user'
    }else{
        var user_id = 'rtu_id';
        var table = 'rtweeted_user';
    }
    var query = `SELECT * FROM ${table} WHERE ${user_id}=${id}`;
    conn.query(query, function(err, result){
        if(err){
            console.log(err);
        }else{
            res.render('show_user', {user: result});
        }
    })
}

exports.get_all_users = function(req, res){
    var temp = req.params.table;
    if(temp == 'auth'){
        var table = 'user';
    }
    if(temp == 'tweets'){
        var table = 'tweet_user';
    }
    if(temp == 'retweets'){
        var table = 'rtweeted_user';
    }
    var init = Number(req.params.init)*100;
    var query = `SELECT * FROM ${table} WHERE id>${init} LIMIT 100`;
    conn.query(query, function(err, result0){
        if(err){
            console.log(err);
        }else{
            conn.query(`SELECT COUNT(*) AS count FROM ${table}`, function(err, result){
                if(err){
                    console.log(err);
                }else{
                    res.render('show_all_users', {users: result0, count: result, id: init, table: temp});
                }
            })
        }
    })
}

exports.all_tweets = function(req, res){
    var init = Number(req.params.init)*100;
    var query = `SELECT * FROM tweets WHERE id>${init} LIMIT 100`;
    conn.query(query, function(err, result0){
        if(err){
            console.log(err);
        }else{
            conn.query(`SELECT COUNT(*) AS count FROM tweets`, function(err, result){
                if(err){
                    console.log(err);
                }else{
                    res.render('stream_string', {stream: result0, count: result, id: init, string: 'all', url: 'streams'});
                }
            })
        }
    })
    
}