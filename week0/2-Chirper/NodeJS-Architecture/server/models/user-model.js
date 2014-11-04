'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var encryption = require('../utilities/encryption');

var userSchema = new Schema({
  name: { type: String, required: '{PATH} is required'},
  email: {type: String, required: '{PATH} is required', unique: true},
  salt: String,
  password: String
});

userSchema.path('name').validate(function (name) {
  return name.length >= 3;
}, 'Username must be at least 6 charactes.');

userSchema.methods.authenticate = function (pass) {
  return encryption.generateHash(this.salt, pass) === this.password;
};

module.exports = mongoose.model('User', userSchema);
