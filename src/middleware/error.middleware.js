// src/middleware/error.middleware.js
function handleErrors(err, req, res, next) {
  console.error(err.stack); // Log the error for debugging

  if (err instanceof ValidationError) {
    // Assuming you're using express-validator
    return res.status(400).json({ errors: err.errors });
  } else if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "Duplicate entry" });
  } else if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ... handle other error types

  res.status(500).json({ message: "Something went wrong" });
}
module.exports = handleErrors;
