// Import necessary packages
const express = require('express');
const router = express.Router();
const winston = require('winston');
const jwt = require('jsonwebtoken');

// Create logger object
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculate-service' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Define endpoint for calculator operation
router.post("/calculator", (req, res) => {
  try {
    // Parse request body for input numbers and operation
    const n1 = parseFloat(req.body.num1);
    const n2 = parseFloat(req.body.num2);
    const opr = req.body.opr;
    
    // Initialize result variable
    var result;

    // Validate input numbers
    if(isNaN(n1)) {
      logger.error("number 1 is incorrectly defined");
      throw new Error("number 1 incorrectly defined");
    }
    if(isNaN(n2)) {
      logger.error("number 2 is incorrectly defined");
      throw new Error("number 2 incorrectly defined");
    }

    // Perform requested operation and log inputs
    if(opr == 'add') {
      logger.info('Parameters '+n1+' and '+n2+' received for addition');
      result = n1+n2;
    } else if (opr == 'sub') {
      logger.info('Parameters '+n1+' and '+n2+' received for subtraction');
      result = n1-n2;
    } else if (opr == 'div') {
      logger.info('Parameters '+n1+' and '+n2+' received for division');
      if (n2 === 0) {
        logger.error("Cannot divide by zero");
        throw new Error("Cannot divide by zero");
      }
      result = n1/n2;
    } else if (opr == 'mul') {
      logger.info('Parameters '+n1+' and '+n2+' received for multiplication');
      result = n1*n2;
    } 

    // Return result as response
    res.status(200).json({statuscocde:200, data: `Result: ${result}` }); 
  } catch(error) { 
    // Catch any errors that occur during calculation and return error message
    console.error(error)
    res.status(500).json({statuscocde:500, msg: error.toString() })
  }
});

// Export router object for use in other files
module.exports = router;
