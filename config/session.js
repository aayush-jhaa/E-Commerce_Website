const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");

function createSessionStore() {
  // Wants session for which mongodb store will be created
  const MongoDBStore = mongoDbStore(expressSession); //Create new mongodb store

  const store = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "online-shop",
    collection: "sessions", // Collection in which sessions are stored
  }); //To create new store object based on constructor func provided by 3rd party package

  return store;
}

function createSessionConfig() {
  // Creates a configuration for our session
  return {
    secret: "super-secret", // For securing the session
    resave: false,
    saveUninitialized: false, // Only saves in database if some value is set if somes changes made
    store: createSessionStore(), // That's store for session created -- it wants the session
    cookie: {
      // If we don't cofigure cookie -- session will be invalidated as cookie will be cleared as user closes the browser
      maxAge: 2 * 24 * 60 * 60 * 1000, // in millisecond
    },
  };
}

module.exports = createSessionConfig;
