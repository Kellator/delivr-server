var express = require('express');
var request = require('request');
var app = express();
var cors = require('cors');
var rp = require('request-promise');
var http = require('http');
var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const searchUrl = 'https://api.yelp.com/v3/transactions/delivery/search';
const tokenUrl = "https://api.yelp.com/oauth2/token?client_id=F1GjwxdHmDgOyEQnFkrOdg&client_secret=6VupwbF7anbAd8yHZYbl9CDDQDFzzmORu2al1E3JkqaI1HSvGEqFSLT6M8VDpLZp&grant_type=client_credentials"; 
var accessToken = '';
var expiration = 0;
// enables pre-flight accross the board
app.options('*', cors()); 
// client app calls server and server makes a request to the remote resource.
app.get('/search', function(req, res, next) {
    var searchRequest = function() {
        let cuisine = req.query.cuisine;
        let location = req.query.location;
        let options = {
                url : searchUrl,
                headers : {
                    'Authorization' : 'Bearer ' + accessToken
                },
                qs : {
                    'location': location,
                    'categories': cuisine
                } 
            }
            request(options, function(error, response, body) {
                console.log(body);
                res.status(200).send(body);
            })
    }
    if (accessToken == '') {
        var url = tokenUrl;
        request.post(url, {}, function(error, response, body) {
            accessToken = JSON.parse(body).access_token;
            searchRequest();
        })
    }
    else {
        searchRequest();
    }
});

app.listen((process.env.PORT || 3030), function () {
    console.log('CORS-enabled web server listening on port 3030')
});