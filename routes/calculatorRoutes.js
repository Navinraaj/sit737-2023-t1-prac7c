/*********************************************************** 
Author              : Navin Raaj
Last Modified Date  : 2023-05-31
Description         : Express router for calculator routes
**********************************************************/

// Import necessary packages
const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../middleware/checkAuthenticated'); // Ensure correct path

// Define route for calculator page
router.get('/calculator', checkAuthenticated, (req, res) => { 
    res.render('index');
});

module.exports = router;
