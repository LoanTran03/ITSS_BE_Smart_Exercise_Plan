var express = require('express');
var router = express.Router();
var db = require('../db');
var helpers = require('../helpers');
var errors = [];

router.get('/register', helpers.loginChecker, function (req, res, next) {

  res.render('register', {
    title: 'Register'
  });

});

router.post('/register', helpers.loginChecker, function (req, res, next) {

  if (!helpers.checkForm([req.body.email, req.body.psw, req.body.pswrepeat, req.body.username])) {
    errors.push('Please fill in all fields!');
    next();
    return;
  }

  if (!helpers.validateEmail(req.body.email)) {
    errors.push('Email không quá 64 kí tự và cần có kí tự @');
    next();
    return;
  }

  if (!helpers.validatePassword(req.body.psw)) {
    errors.push('Mật khẩu trên 8 kí tự, ít nhất 1 chữ cái, 1 chữ số và 1 chữ thường');
    next();
    return;
  }

  if (req.body.psw !== req.body.pswrepeat) {
    errors.push('Xác nhận mật khẩu sai!');
    next();
    return;
  }

  var sqlQuery = `INSERT INTO users VALUES(NULL, ?, ?, ?)`;
  var values = [req.body.username, req.body.email, req.body.psw];

  db.query(sqlQuery, values, function (err, results, fields) {

    if (err) {
      errors.push(err.message);
      next();
      return;
    }

    if (results.affectedRows == 1) {
      res.redirect('/login');
      return;
    } else {
      errors.push(err.message);
      next();
    }

  });

});

router.post('/register', function (req, res, next) {

  res.statusCode = 401;

  res.render('register', {
    title: 'Register',
    messages: errors
  });

  errors = [];

});

router.get('/login', helpers.loginChecker, function (req, res, next) {

  res.render('login', {
    title: 'Login'
  });

});

router.post('/login', function (req, res, next) {

  if (!helpers.checkForm([req.body.email, req.body.psw])) {
    errors.push('Please fill in all fields!');
    next();
    return;
  }

  if (!helpers.validateEmail(req.body.email)) {
    errors.push('Email không quá 64 kí tự và cần có kí tự @');
    next();
    return;
  }

  var sqlQuery = `SELECT * FROM user WHERE user_email = ? AND user_pass = ?`;
  var values = [req.body.email, req.body.psw];

  db.query(sqlQuery, values, function (err, results, fields) {

    if (err) {
      errors.push(err.message);
      next();
      return;
    }

    if (results.length == 1) {
      req.session.authorised = true;
      req.session.fname = results[0].user_fname
      res.redirect('/');
      return;
    } else {
      errors.push('Sai mật khẩu hoặc email');
      next();
    }

  });

});

router.post('/login', function (req, res, next) {

  res.statusCode = 401;

  res.render('login', {
    title: 'Login',
    messages: errors
  });

  errors = [];

});

router.get('/exit', function (req, res, next) {

  req.session.destroy(function (err) {
    res.redirect('/');
  });

});

module.exports = router;