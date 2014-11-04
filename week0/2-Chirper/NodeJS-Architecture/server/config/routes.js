'use strict';

var path = require('path');

module.exports = function (app, rootPath, data) {
  var controllers = require(path.join(rootPath,'/server/controllers'))(data);

  app.use('/users', controllers.users);

  app.get('/', function (req, res) {
    res.render('home');
  });

  app.get('*', function (req, res) {
    res.render('404');
  });
};
