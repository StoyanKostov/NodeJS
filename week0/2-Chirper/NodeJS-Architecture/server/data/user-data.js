'use strict';

var Q = require('q');
var encryption = require('./../utilities/encryption');
var User = require('mongoose').model('User');
var data = {};

data.create = function (user) {
  var deferred = Q.defer();

  User.findOne({email: user.email})
  .exec(function (err, userFromDb) {
    if(err) {
      return deferred.reject(err);
    }

    if (userFromDb) {
      return deferred.reject({message: 'Email is already taken'});
    }

    var salt = encryption.generateSalt();
    var newUser = new User({
      name: user.name,
      email: user.email,
      salt: salt,
      password: encryption.generateHash(salt, user.password)
    });

    newUser.save(function (err, saved) {
      if (err) {
        return deferred.reject(err);
      }

      return deferred.resolve({
        name: saved.name,
        email: saved.email
      });
    });

  });

  return deferred.promise;
};

data.findById = function (id) {
  var deferred = Q.defer();

  User.findById(id)
  .exec(function (err, user) {
    if(err) {
      return deferred.reject(err);
    }

    return deferred.resolve(user);
  });

  return deferred.promise;
};

data.findByEmail = function (email) {
  var deferred = Q.defer();

  User.findOne({ email: email })
  .exec(function (err, user) {
    if(err) {
      return deferred.reject(err);
    }

    return deferred.resolve(user);
  });

  return deferred.promise;
};

module.exports = data;
