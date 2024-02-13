function getSessionData(req) {
  const sessionData = req.session.flashedData;

  req.session.flashedData = null;

  return sessionData;
}

// we dont call req.session.save() here bcoz it is called  when we wanna ensure saving finished before doing some action

function flashDataToSession(req, data, action) {
  // req - to access the session -- data - needs to be flashed -- action - that should be executed once the session is stored

  req.session.flashedData = data; // data stored in flashedData(Our Choice) key to the session
  req.session.save(action);
}

module.exports = {
  getSessionData: getSessionData,
  flashDataToSession: flashDataToSession,
};
