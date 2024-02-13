function createUserSession(req, user, action) {
  // req - to access the session -- user - to acess the data belongs to user -- action - action to be takes place once the session was updated
  req.session.uid = user._id.toString(); // _id - format used in mongoDb internally in db
  req.session.isAdmin = user.isAdmin;
  req.session.save(action); // save method - executes save -- executes action once session is succesfully saved
  // This action is anonymous function in auth.controller.js file
}

function destroyUserAuthSession(req) {
  req.session.uid = null; // Nothing - No Value -- we can also call save if we want to do some actions
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
