'use strict';

var REGISTER_SUCCESS = 'Your registration was successful.';
var PASSWORD_MISMATCH = 'Passwords do not match';

var router = require('express').Router();

module.exports = function (auth, userData) {
  router.get('/register', function (req, res) {
    res.render('users/register');
  });

  router.post('/register', function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
      req.session.errorMessage = PASSWORD_MISMATCH;
      return res.redirect('/users/register');
    }

    userData.create(req.body)
      .then(function success(user) {
        req.session.successMessage = REGISTER_SUCCESS;
        res.redirect('/users/login');
      }, function error(err) {
        req.session.errorMessage = err.message;
        res.redirect('/users/register');
      });
  });

  router.get('/login', function (req, res) {
    res.render('users/login');
  });

  router.post('/login', auth.login);

  router.get('/logout', auth.logout);

  return router;
};
