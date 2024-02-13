function handleErrors(error, req, res, next) {
  console.log(error);

  if (error.code === 404) {
    return res.status(404).render("shared/404");
  }

  res.status(500).render("shared/500"); // 500 -- server-side error
} // recieves four parameters value - error -- express call this func. whenever there is a error in other MW

module.exports = handleErrors;
