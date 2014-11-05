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

//http://stackoverflow.com/questions/10695629/node-js-express-next
//http://stackoverflow.com/questions/25507866/how-can-i-use-a-cursor-foreach-in-mongodb-using-node-js
//http://stackoverflow.com/questions/23642510/how-to-send-mongodb-query-result-as-a-json-response-using-express

//http://docs.mongodb.org/manual/tutorial/build-a-2dsphere-index/

// Cross domain
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
  res.header("Access-Control-Allow-Methods", ["POST, GET"]);
  next();
});

MongoClient.connect(config.mongoConnection.url, function(err, db) {
  assert.equal(null, err);
  console.log("MongoClient connected correctly to server");
  var collection = db.collection('saveItFindIt');
  collection.ensureIndex({location : "2dsphere"});
  app.use(bodyParser.json());
  //app.use(express.urlencoded());
  app.get('/find-location', function (req, res, next) {
    console.log('/find-location');
    var range = req.query.range * 1000;
    var lng = geoJSONlatLngParse(req.query.position.lng);
    var lat = geoJSONlatLngParse(req.query.position.lat);
    collection.find({
    location: 
      {
        $nearSphere: {
          $geometry: {
            type : "Point",
            coordinates : [ lng, lat ],
          },
          $maxDistance: range, //В метри
        }
      }
    }).toArray(function(err, documents){
      assert.equal(null, err);
      var googleMapPoints = documents.map(function(val, index, arr){
        var tempPoint = {};
        tempPoint['name'] = val['name'];
        tempPoint['coordinates'] = val['location']['coordinates'];
        return tempPoint;
      });
      res.json(googleMapPoints);
    });
    //next();
  });

  app.post('/save-location', function (req, res, next) {
    console.log('/save-location');
    var lng = geoJSONlatLngParse(req.body.position.lng);
    var lat = geoJSONlatLngParse(req.body.position.lat);
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
    res.send('{"success" : "Location saved succesful"}');
    //next();
  });

  var server = app.listen(config.port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Geospatial app listening at http://%s:%s', host, port)
  });
  
  //db.close();
});

/*Helper function*/
function geoJSONlatLngParse(value){
  //return parseFloat(value).toFixed(2);
  return parseFloat(parseFloat(value).toFixed(2));
}