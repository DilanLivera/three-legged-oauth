// make sure the user is logged in
exports.loginRequired = function (req, res, next) {
  try {
    if (req.session.access_token) {
      return next();
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    return next({
      status: 401,
      message: "Please log in first"
    });
  }
}

//make sure we get the correct user
exports.ensureCorrectUser = function (req, res, next) {
  // try {
  //   const token = req.headers.authorization.split(" ")[1];
  //   jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
  //     if (decoded && decoded.id === req.params.id) {
  //       return next();
  //     } else {
  //       return next({
  //         status: 401,
  //         message: "Unauthorized"
  //       });
  //     }
  //   });
  // } catch (err) {
  //   return next({
  //     status: 401,
  //     message: "Unauthorized"
  //   });
  // }
}