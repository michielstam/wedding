var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://prmgswwteyqepp:O0Wu5eZhZKEzrtdwu7iMpi2cMe@ec2-54-197-241-239.compute-1.amazonaws.com:5432/d4ulen39c8bnhs';

/*-- 'postgres://localhost:5432/wedding'; --*/


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/book')
  .get(function(req, res) {
    res.send('Get a random book');
  })
  .post(function(req, res) {
    res.send('Add a book');
  })
  .put(function(req, res) {
    res.send('Update the book');
  });

router.route('/aanmelden').post(function(req,res) {
	
	var results = [];
	
	var data = {name: req.body.name, email: req.body.email, kerk: req.body.kerk, receptie: req.body.receptie, feest: req.body.feest, aantal: req.body.aantal};
	
	
	pg.connect(connectionString, function(err, client, done) {
		// Handle connection errors
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({ succes: false, data: err});
		}
		// SQL Query > Insert Data
		var query = client.query("INSERT INTO dbo.gasten(name, email, kerk, receptie, feest, aantal) values($1, $2, $3, $4, $5, $6)", [data.name, data.email, data.kerk, data.receptie, data.feest, data.aantal]);
		
		query.on('end', function() {
			done();
			return res.send({"data":[
			    {"succes": true, "message":""}
			]});			
		});
	})
});

// POST method route
router.post('/test', function (req, res) {
  	return res.status(200),json({"data":[
	    {"succes": true, "message":"Doe"}
	]})	
});

router.get('/gasten', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {text: req.body.text, complete: false};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM dbo.gasten");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

<<<<<<< HEAD
=======
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


>>>>>>> f16b0b9c795ade08125662629e6c5b2c0f697abc
module.exports = router;