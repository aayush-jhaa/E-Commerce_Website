function isEmpty(value) {
  return !value || value.trim() == "";
}

function userCredentialsAreValid(email, password) {
  return email && email.includes("@") && password.trim().length >= 6;
}

function userDetailsAreValid(email, password, name, street, postal, city) {
  // How to validate ?? -- Check for boolean value
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
    // name &&
    // name.trim() !== "" // Repaeat all those for street postal !!
  );
}

function emailIsConfirmed(email, confirmEmail) {
  return email === confirmEmail;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed,
};
