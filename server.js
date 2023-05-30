require('dotenv').config()
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const microserviceRoutes = require('./ms');
const bcrypt = require('bcryptjs')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const JWTstrategy = require("passport-jwt").Strategy;
const fakeLocal = require("./fakelocal.json");
const connectDB = require('./database.js');
var mongoose = require('mongoose');


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
const initializePassport = require('./passport-config') 
initializePassport(
  passport,
  email => User.findOne({ email: email }),
  id => User.findById(id)
)


let questionPool = [
  {index:[1], title: 'What is 2+2?', options: ['3', '4', '5', '6'], correctAnswer: '4' },
  {index:[2], title: 'What color is the sky?', options: ['Blue', 'Green', 'Purple', 'Yellow'], correctAnswer: 'Blue' },
  {index:[3], title: 'What do cows drink?', options: ['Milk', 'Water', 'Juice', 'Tea'], correctAnswer: 'Water' },
  {index:[4], title: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 'Mars' },
  {index:[5], title: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], correctAnswer: '8' },
  {index:[6], title: 'Which fruit is known as the King of Fruits?', options: ['Apple', 'Banana', 'Mango', 'Peach'], correctAnswer: 'Mango' },
  {index:[7], title: 'What color are emeralds?', options: ['Red', 'Blue', 'Green', 'Yellow'], correctAnswer: 'Green' },
  {index:[8], title: 'Which animal is known as the King of the Jungle?', options: ['Lion', 'Elephant', 'Tiger', 'Monkey'], correctAnswer: 'Lion' },
  { index:[10],title: 'How many days are there in a leap year?', options: ['365', '366', '367', '368'], correctAnswer: '366' },
  { index:[9],title: 'Which bird cannot fly?', options: ['Ostrich', 'Eagle', 'Parrot', 'Penguin'], correctAnswer: 'Ostrich' },
  { index:[11],title: 'How many colors are in a rainbow?', options: ['5', '6', '7', '8'], correctAnswer: '7' },
  {index:[12], title: 'Which part of the plant conducts photosynthesis?', options: ['Root', 'Stem', 'Leaf', 'Flower'], correctAnswer: 'Leaf' },
  { index:[13],title: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], correctAnswer: 'Carbon dioxide' },
  {index:[14], title: 'What is the capital of England?', options: ['Manchester', 'Birmingham', 'London', 'Liverpool'], correctAnswer: 'London' },
  {index:[15], title: 'Which is the largest ocean in the world?', options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], correctAnswer: 'Pacific Ocean' }
];

connectDB();

const UserSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true
  }
});

const User = mongoose.model('userdata', UserSchema);



app.use(passport.initialize())

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
    res.render('index.ejs', { name: req.user.name })
  })

  app.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('signup.ejs')
  })

  app.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    await user.save();
    res.redirect('/login')
  } catch (err) {
    console.error(err);
    res.redirect('/signup')
  }
})

  

// Route for the profile page
app.get('/profile', (req, res) => {
  if (req.user) {
    res.render('profile', { user: req.user });
  } else {
    res.redirect('/login');
  }
});

app.get('/editprofile', (req, res) => {
  if (req.user) {
    res.render('edit_profile', { user: req.user });
  } else {
    res.redirect('/profile');
  }
});


app.get('/quiz', (req, res) => {
  if (req.user) {
    // Shuffle function
    function shuffle(array) {
      array.sort(() => Math.random() - 0.5);
    }
    
    // Shuffle the question pool
    shuffle(questionPool);
    
    // Select the first N questions
    let questionsArray = questionPool.slice(0, 5); // Choose how many questions you want each time
    let correctAnswersArray = questionsArray.map(question => question.correctAnswer);
    
    res.render('quiz', { user: req.user, questions: questionsArray, correctAnswers: correctAnswersArray });
  } else {
    res.redirect('/login');
  }
});


app.post('/submitQuiz', checkAuthenticated, (req, res) => {
  const userAnswers = req.body;
  let score = 0;
  
  for (const [index, userAnswer] of Object.entries(userAnswers)) {
    const question = questionPool[parseInt(index.replace("question", ""))];
    if (question) {
      if (question.correctAnswer === userAnswer) {
        score++;
      }
    } else {
      console.log("Question not found at index:", index);
    }
  }
  
  res.json({ score });
});





app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err); 
    if (!user) return res.redirect('/login'); 
    req.logIn(user, err => {
      if (err) return next(err);
      return res.redirect('/calculator');
    });
  })(req, res, next);
});

// Route to serve the Edit Profile page
app.get('/profile/edit', checkAuthenticated, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render('edit_profile', { user: user });
});

// Route to handle form submission
app.post('/profile/edit', checkAuthenticated, async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user.id);
  user.name = name;
  user.email = email;

  // Encrypt the new password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  await user.save();
  res.redirect('/profile');
});


app.get('/calculator',checkAuthenticated,(req,res)=> { 
    res.render('index');
});
app.post('/getResult',passport.authenticate("jwt",{session: false}),(req,res) => {
    let operation = req.query.op;
    res.send(operation);
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

const port = 8080;
const host = "0.0.0.0";
var server = app.listen(port,host,() => {
    console.log('server is listening on port', server.address().port);
});