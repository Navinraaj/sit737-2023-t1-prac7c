const express = require("express");
const app = express();
const fs = require("fs");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "calculate-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const add = (n1, n2) => {
  return n1 + n2;
};

const subtract = (n1, n2) => {
  return n1 - n2;
};

const multiply = (n1, n2) => {
  return n1 * n2;
};

const divide = (n1, n2) => {
  if (n2 === 0) {
    logger.error("Division by zero");
    throw new Error("Division by zero");
  }
  return n1 / n2;
};

const handleCalculationRequest = (req, res, operation) => {
  try {
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);

    if (isNaN(n1)) {
      logger.error("n1 is incorrectly defined");
      throw new Error("n1 incorrectly defined");
    }

    if (isNaN(n2)) {
      logger.error("n2 is incorrectly defined");
      throw new Error("n2 incorrectly defined");
    }

    logger.info(`Parameters ${n1} and ${n2} received for ${operation}`);

    const result = operation(n1, n2);
    res.status(200).json({ statuscode: 200, data: result });
  } catch (error) {
    logger.error(error.toString());
    res.status(500).json({ statuscode: 500, msg: error.toString() });
  }
};

app.get("/add", (req, res) => {
  handleCalculationRequest(req, res, add);
});

app.get("/subtract", (req, res) => {
  handleCalculationRequest(req, res, subtract);
});

app.get("/multiply", (req, res) => {
  handleCalculationRequest(req, res, multiply);
});

app.get("/divide", (req, res) => {
  handleCalculationRequest(req, res, divide);
});

const port = 3040;
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});