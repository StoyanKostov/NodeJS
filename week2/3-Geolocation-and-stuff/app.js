var express = require('express')
  , config = require('./config')()
  , app = express()
  , bodyParser = require('body-parser')
  , MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

//http://blog.mongolab.com/2013/11/deep-dive-into-connection-pooling/

//express js and mongoclient tutorial
//http://code.tutsplus.com/tutorials/build-a-complete-mvc-website-with-expressjs--net-34168

// Geospatial Index Tutorials
// http://docs.mongodb.org/manual/administration/indexes-geo/

// Cross domain
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
  res.header("Access-Control-Allow-Methods", ["POST, GET"]);
  next();
});

// app.get('/', function (req, res, next) {
//   res.send('Hello World!')
//   console.log(res);
//   next();
// });

MongoClient.connect(config.mongoConnection.url, function(err, db) {
  assert.equal(null, err);
  console.log("MongoClient connected correctly to server");
  var collection = db.collection('saveItFindIt');
  collection.ensureIndex({location : "2dsphere"});
  // collection.find({}).toArray(function(err, docs) {
  //   assert.equal(err, null);
  //   console.log("Found the following records");
  //   console.dir(docs)
  //   db.close();
  // });

  // collection.insert(JSON.parse(data), function(err, docs){
  //   assert.equal(null, err);
  //   //assert.equal(JSON.parse(data).length, docs.docs.n);
  //   //assert.equal(JSON.parse(data).length, docs.ops.length);
  //   //console.log(err);
  //   console.log(docs);
  //   db.close();
  // });
  app.use(bodyParser.json());
  //app.use(express.urlencoded());

  app.get('/find-location', function (req, res, next) {
    // console.log('req', req);
    // console.log('req.query', req.query);
    //console.log('res', res);
    console.log('/find-location');
    //res.json(data);
    //res.send('{"success" : "performed GET", "status" : 200}');
    //res.send(req.query);
    //http://docs.mongodb.org/manual/reference/operator/query/nearSphere/
    var range = req.query.range * 1000;
    var lng = geoJSONlatLngParse(req.query.position.lng);
    var lat = geoJSONlatLngParse(req.query.position.lat);
    var dbQueryRes = collection.find(
                     {
                       location: {
                          $nearSphere: {
                             $geometry: {
                                type : "Point",
                                coordinates : [ lng, lat ],
                             },
                             $maxDistance: range, //В метри
                          }
                       }
                     }
                  );
    res.json(dbQueryRes);
    next();
  });

  app.post('/save-location', function (req, res, next) {
    var lng = geoJSONlatLngParse(req.body.position.lng);
    var lat = geoJSONlatLngParse(req.body.position.lat);
    //http://docs.mongodb.org/manual/tutorial/build-a-2dsphere-index/
    collection.insert(
       {
          location : 
            { 
              type: "Point", 
              coordinates: [ lng, lat ],
            },
          name: req.body.name,
          tags : req.body.tags,
       }
    );
    res.send('{"success" : "Location saved succesful", "status" : 200}');
    next();
  });

  var server = app.listen(config.port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Geospatial app listening at http://%s:%s', host, port)
  });
  
  //db.close();
});

function geoJSONlatLngParse(value){
  //return parseFloat(value).toFixed(2);
  return parseFloat(parseFloat(value).toFixed(2));
}