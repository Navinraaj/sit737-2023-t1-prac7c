/*********************************************************** 
Author              : Navin Raaj
Last Modified Date  : 2023-05-31
Description         : Express router for quiz routes
**********************************************************/


const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../middleware/checkAuthenticated');
const Score = require('../models/Score');


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

// Define route for taking the quiz
router.get('/quiz', checkAuthenticated, async (req, res) => {
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
  
  // Define route for submitting the quiz
  router.post('/submitQuiz', checkAuthenticated, async (req, res) => {
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
  
    // Create a new score document
    const newScore = new Score({
      userId: req.user._id,
      score
    });
  
    // Save the score document to the database
    try {
      await newScore.save();
      console.log("Score saved to database");
    } catch (err) {
      console.error("Error saving score to database:", err);
    }
  
    res.json({ score });
  });
  
  module.exports = router;