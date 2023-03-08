const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(400).json({
      errors: {
        msg: "Token inválido",
      },
    });
  }

  jwt.verify(token, process.env.PRIVATE_KEY, (err, data) => {
    if (err) {
      return res.status(401).json({
        errors: {
          msg: "Token inválido",
        },
      });
    }
    next();
  });
};

module.exports = auth;
