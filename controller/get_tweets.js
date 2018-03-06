var conn = require('../routes/conn');

var Twitter = require('twitter');

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
                      console.log(tweet);
                    });
                  
                    stream.on('error', function(error) {
                      console.log(error);
                    });
                });
            }
        }
    })
}