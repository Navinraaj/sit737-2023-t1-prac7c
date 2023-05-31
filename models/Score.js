/*********************************************************** 
Author              : Navin Raaj
Last Modified Date  : 2023-05-31
Description         : Schema for Score database
**********************************************************/

const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  },
  score: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now // Default value set to the current date and time
  }
});

module.exports = mongoose.model('Score', ScoreSchema);
