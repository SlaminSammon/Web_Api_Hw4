var Usergrid = require('usergrid');
var express = require('express')
var app = express()
var dataclient = new Usergrid.client({
	orgName:'slamminsammons', //Org name
	appName:'movie-store', //App name
});


app.get('/gets/movies', function (req, res) {
    var options = {
	endpoint:"movies", // the collection we are going to query
	qs:{ql:req.query.title}
    }
    dataclient.request(options, function(err,data){
        
    	if(err){
	    	res.send(err)
    	}
    	else{
    	    if(req.query == {}){
	    	res.send(data)//If user requests entire list
    	    }
    	    else{
    	       res.send(data) 
    	    }
	    }
    })
});
app.post('/posts/movies', function (req, res) {
    var options = {
    method:'POST',
    endpoint:'movies',
    body:{Title: req.headers.title,
    Year: req.headers.year,
    Actors: [
        req.headers.actor_1,
        req.headers.actor_2,
        req.headers.actor_3
        ]
    }}
    var error = false
    if(typeof req.headers.title != 'string' || typeof req.headers.year != 'string' || typeof req.headers.actor_1 != 'string'
        || typeof req.headers.actor_2 != 'string' || typeof req.headers.actor_3 != 'string'){
        res.send("Not enough data passed!")
        error = true
    }
    dataclient.request(options, function (err, data) {
    if (err || error) {
        //error - POST failed
    } else {
        res.send(data) 
    }
});

});
app.delete('/deletes/movies', function (req, res){
    
    var options = {
    method:'DELETE',
    endpoint:'movies/' + req.headers.uuid
};
dataclient.request(options, function (err, data) {
    if (err) {
        //error - DELETE failed
        res.send(err)
    } else {
        //data will contain raw results from API call
        //success - DELETE worked
        res.send("Deleted Movie Entry!")
    }
});
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});