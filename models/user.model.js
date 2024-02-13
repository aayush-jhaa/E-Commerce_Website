const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../data/database");

class User {
  constructor(email, password, fullname, street, postal, city) {
    // data stored not in db but in to be created user object
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    return db.getDb().collection("users").findOne({ _id: uid }, { projection: {password: 0} }); // gives pureDocument not User Model Instance
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email }); //findOne yeilds a promise
  } // Identifies user having same email address --- Method for comparing passwords and checks user exist already

  async existsAlready() {
    // returns true -- if user trying to create exist already
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    // method that it does stores data to database
    const hashedPassword = await bcrypt.hash(this.password, 12); // Salting rounds - 12

    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword, // Mustn't stored as plain text
      name: this.name,
      address: this.address,
    }); // Collection of documents with no fixed schemas
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword); // compare returns a promises
  }
}

module.exports = User; // Export User class as whole
