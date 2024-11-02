const { validationResult } = require("express-validator");

const validatorMiddleware = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // If there are validation errors, return a 400 response with the error details
    return res.status(400).send({ errors: result.array() });
  }
  // If no errors, proceed to the next middleware/controller
  next();
};

module.exports = validatorMiddleware;
