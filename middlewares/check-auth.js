function checkAuthStatus(req, res, next) {
  const uid = req.session.uid; // It has value if user did login before

  if (!uid) {
    return next();
  }

  res.locals.uid = uid;
  res.locals.isAuth = true; // This information could be used in our views -- say header
  res.locals.isAdmin = req.session.isAdmin;
  next();
}

module.exports = checkAuthStatus;
