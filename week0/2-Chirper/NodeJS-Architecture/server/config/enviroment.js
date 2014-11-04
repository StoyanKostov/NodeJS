'use strict';

var enviroment = {};

enviroment.dev = {
  connectionString: 'mongodb://localhost:27017/exam',
  port: process.env.PORT || 3000
};

module.exports = enviroment;
