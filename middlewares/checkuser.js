const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
  const token = req.headers["authorization"];
  const { debtorId } = req.params;

  if(!token){
    return res.status(400).json({
      errors:{
        msg: "Token inválido"
      }
    })
  }

  jwt.verify(token, process.env.PRIVATE_KEY, (err, data) => {
    if (data.id !== parseInt(debtorId)) {
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
