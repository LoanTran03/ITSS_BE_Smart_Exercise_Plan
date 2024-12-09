function validateEmail(email) {
  if (email.length > 64 || !email.includes("@")) {
    return false;
  } else {
    return true;
  }
}

function validatePassword(password) {
  var check = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (password.length <= 8) {
    return false;
  }
  return check.test(password);
}

function loginChecker(req, res, next) {
  if (req.session.authorised) {
    res.redirect('/');
    return;
  } else {
    next();
    return;
  }
}

function checkForm(fields) {

  for (var i = 0; i < fields.length; i++) {
    var currElement = fields[i];

    if (currElement == undefined || currElement == '') {
      return false;
    }

  }
  return true;
}

module.exports.checkForm = checkForm;

module.exports.loginChecker = loginChecker;

module.exports.validateEmail = validateEmail;

module.exports.validatePassword = validatePassword;