const path = require("path"); // Built-in package to create absolute path

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const notFoundMiddleware = require("./middlewares/not-found");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.set("view engine", "ejs"); // Make express aware of ejs
app.set("views", path.join(__dirname, "views")); // Make express aware of views folder //__dirname- Global Variable

app.use(express.static("public")); //Serves public folder files statically when request made by browser regarding CSS files
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false })); // Handling data incoming with request when form being submitted
app.use(express.json());

const sessionConfig = createSessionConfig(); // Gives session configuration

app.use(expressSession(sessionConfig)); // Before csrf - coz csrf needs session -- function takes parameter the session configuration
app.use(csrf()); // Returns MW -- So CSRF protection all incoming request which are not GET request now neeed to have TOKEN attached

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware); // After expressSession - bcoz we want to access the session

app.use(baseRoutes);
app.use(authRoutes); //Allow us to add MW that triggered for every incoming request
app.use(productsRoutes);
app.use("/cart", cartRoutes); // Above them so that non authenticated can also add to cart items
//Protecting the routes where authentication and authorization(admin privilege)
app.use("/orders", protectRoutesMiddleware,  ordersRoutes); // Only available after you are logged in
app.use("/admin", protectRoutesMiddleware ,adminRoutes); //Using filter
// That's why protectRoutesMiddleware is added as parameter in app.use above and executed left to right
app.use(notFoundMiddleware); // We can't put this handler above protectRoutesMiddleware bcoz all other routes never reached - this MW handles every request

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
