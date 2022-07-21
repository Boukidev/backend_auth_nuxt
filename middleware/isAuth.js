const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authentificated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.splite(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "GZE2I7HNJ9HEF8M?JEZ5!");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated !");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
