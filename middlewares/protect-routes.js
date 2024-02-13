function protectRoutes(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect("/401"); // --401 code when user are not authenticated
  }

  if (req.path.startsWith("/admin") && !res.locals.isAdmin) {
    return res.redirect("/403"); // -- 403 code means you're not authorized
  }

  next();
}

module.exports = protectRoutes;
