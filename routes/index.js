var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://prmgswwteyqepp:O0Wu5eZhZKEzrtdwu7iMpi2cMe@ec2-54-197-241-239.compute-1.amazonaws.com:5432/d4ulen39c8bnhs';



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//write
router.post('/api/v1/todos', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {text: req.body.text, complete: false};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Insert Data
        client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });
});

//read guest
router.get('/gasten', function(req,res) {
	
	var results = [];
	
	// Get a Postgres client from connection pool
	pg.connect(connectionString, function(err, client, done) {
		
		// SQL Query > Select Data
		var query = client.query("SELECT * FROM dbo.gasten ORDER BY id ASC;")
		
		// Stream results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});
		
		// After all data is returned, close connection
		query.on('end', function() {
			client.end();
			return res.json(results);
		});
		
		// Handle Errors
		if(err) {
			console.log(err);
		}
	});
});


module.exports = router;