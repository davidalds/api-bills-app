const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
  const token = req.headers["authorization"];
  const { debtorUid } = req.params;

  if (!token) {
    return res.status(400).json({
      errors: {
        msg: "Token inválido",
      },
    });
  }

  jwt.verify(token, process.env.PRIVATE_KEY, (err, data) => {
    if (data.uid !== debtorUid) {
      return res.status(401).json({
        errors: {
          msg: "Você não possui permissão",
        },
      });
    }
    next();
  });
};

module.exports = checkUser;
