require('dotenv').config()
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const microserviceRoutes = require('./Ms');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const JWTstrategy = require("passport-jwt").Strategy;
const fakeLocal = require("./fakeLocal.json");

const users = []

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/api', microserviceRoutes)
app.use(express.json());
app.set("view engine", "ejs");
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
app.use(passport.session()) 
app.use(passport.initialize())


const initializePassport = require('./passport-config') 
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

function getJwt() {
    console.log("in getJwt");
    return fakeLocal.Authorization?.substring(7); // remove the "Bearer " from the token.
}

passport.use(
    new JWTstrategy(
      {
        secretOrKey: "TOP_SECRET",
        jwtFromRequest: getJwt,
      },
      async (token, done) => {
        console.log("in jwt strat. token: ", token);

        if (token?.user?.email == "tokenerror") {
          let testError = new Error(
            "something bad happened. we've simulated an application error in the JWTstrategy callback for users with an email of 'tokenerror'."
          );
          return done(testError, false);
        }
  
        if (token?.user?.email == "emptytoken") {
          return done(null, false); // unauthorized
        }
        // 3. Successfully decoded and validated user:
        return done(null, token.user);
      }
    )
  );
app.get('/', checkAuthenticated, (req, res) => {
    res.render('calculator.ejs', { name: req.user.name })
  })

  app.get('/Signup', checkNotAuthenticated, (req, res) => {
    res.render('Signup.ejs')
  })
  app.post('/Signup', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/Signup')
    }
  })
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {successRedirect: '/calculator',failureRedirect: '/login',failureFlash: true}), (req, res) => {
    const user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    }
    const token = jwt.sign(user ,process.env.ACCESS_TOKEN_SECRET);
    res.json({ token : token });
  });
app.get('/calculator',checkAuthenticated,(req,res)=> { 
    res.render('calculator');
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
      return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/calculator')
    }
    next()
}

var server = app.listen(3000,() => {
    console.log('server is listening on port', server.address().port);
});