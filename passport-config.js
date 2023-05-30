const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fs = require("fs");

getUserByEmail = async email => await User.findOne({ email: email });
getUserById = async id => await User.findById(id);
initialize = (passport, getUserByEmail, getUserById) => {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email) // Await here if getUserByEmail is a Promise
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }
  

    try {
      if (await bcrypt.compare(password, user.password)) {
        let token = jwt.sign({ name: user }, "TOP_SECRET");
        console.log(token);
        // return token;
        fs.writeFile(
            "fakelocal.json",
            JSON.stringify({ Authorization: `Bearer ${token}` }),
            (err) => {
              if (err) throw err; // we might need to put this in a try catch, but we'll ignore it since it's unrelated to passport and auth.
            }
          );
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
})
}
module.exports = initialize