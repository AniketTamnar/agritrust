

// middleware/devAuth.js
module.exports = (req, res, next) => {
  req.user = { id: "user123" };
  next();
};
