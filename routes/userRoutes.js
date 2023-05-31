/*********************************************************** 
Author              : Navin Raaj
Last Modified Date  : 2023-05-31
Description         : Express router for authentication and user profile routes
**********************************************************/

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const checkAuthenticated = require('../middleware/checkAuthenticated');
const checkNotAuthenticated = require('../middleware/checkNotAuthenticated');
const User = require('../models/user');
const Score = require('../models/Score');

// Route for signing up a new user
router.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('signup.ejs');
});

// Route for viewing user profile
router.get('/profile', checkAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

// Route for editing user profile
router.get('/editprofile', (req, res) => {
    if (req.user) {
      res.render('edit_profile', { user: req.user });
    } else {
      res.redirect('/profile');
    }
});

// Route for handling signup form submission
router.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/signup');
  }
});

// Route for displaying login page
router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

// Route for handling login form submission
router.post('/login', checkNotAuthenticated, async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        // No user found with the given email
        return res.render('login', { error: 'No user available with the given email. Please sign up.' });
      }
      req.logIn(user, err => {
        if (err) return next(err);
        return res.redirect('/calculator');
      });
      // Handle incorrect password separately
      if (info && info.message === 'Incorrect password.') {
        return res.render('login', { error: 'Incorrect password.' });
      }
    })(req, res, next);
});

// Route for logging out the user
router.get('/logout', checkAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error occurred while destroying the session:', err);
      res.status(500).send('An error occurred while logging out. Please try again later.');
    } else {
      res.redirect('/login');
    }
  });
});

// Route for editing user profile
router.get('/profile/edit', checkAuthenticated, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render('edit_profile', { user: user });
});

// Route for handling user profile edit form submission
router.post('/profile/edit', checkAuthenticated, async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user.id);
  user.name = name;
  user.email = email;
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();
  res.redirect('/profile');
});

// Route for deleting user profile
router.post('/profile/delete', checkAuthenticated, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.user.id);

      await Score.deleteMany({ userId: req.user._id });

      req.logout(() => {
        res.redirect('/login');
      });      
    } catch (error) {
      console.error(error);
      res.redirect('/profile/edit');
    }
});

module.exports = router;
