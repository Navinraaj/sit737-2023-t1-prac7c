/*********************************************************** 
Author              : Navin Raaj
Last Modified Date  : 2023-05-31
Description         : Passport configuration for authentication
**********************************************************/

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require("fs");

/**
 * Function to get a user by email
 * @param {string} email - User email
 * @returns {Promise} - Promise representing the user with the given email
 */
getUserByEmail = async email => await User.findOne({ email: email });

/**
 * Function to get a user by ID
 * @param {string} id - User ID
 * @returns {Promise} - Promise representing the user with the given ID
 */
getUserById = async id => await User.findById(id);

/**
 * Initialize passport configuration
 * @param {Object} passport - Passport instance
 * @param {Function} getUserByEmail - Function to get a user by email
 * @param {Function} getUserById - Function to get a user by ID
 */
initialize = (passport, getUserByEmail, getUserById) => {
  /**
   * Authenticate user using local strategy
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Function} done - Callback function
   */
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email); // Await here if getUserByEmail is a Promise
    if (user == null) {
      return done(null, false, { message: 'No user with that email' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        let token = jwt.sign({ name: user }, "TOP_SECRET");
        console.log(token);
        fs.writeFile(
          "fakelocal.json",
          JSON.stringify({ Authorization: `Bearer ${token}` }),
          (err) => {
            if (err) throw err;
          }
        );
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

module.exports = initialize;
