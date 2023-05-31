/*********************************************************** 
Author              : Navin Raaj
Last Modified Date  : 2023-05-31
Description         : Express router for dashboard routes
**********************************************************/

const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../middleware/checkAuthenticated');
const Score = require('../models/Score');

// Define route for viewing the dashboard
router.get('/dashboard/view', checkAuthenticated, async (req, res) => {
    // Fetch the scores for the current user
    const scores = await Score.find({ userId: req.user.id });
  
    // Render the dashboard view, passing the scores to the view
    res.render('dashboard', { user: req.user, scores: scores });
});

module.exports = router;
