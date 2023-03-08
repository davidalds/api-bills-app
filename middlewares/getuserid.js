const Debtor = require("../models/Debtor");

const getuserid = async (req, res, next) => {
  try {
    const { debtorUid } = req.params;
    const debtor = await Debtor.findOne({ where: { uid: debtorUid } });

    if (!debtor) {
      return res.status(404).json({
        errors: {
          msg: "Identificador do usuário inválido",
        },
      });
    }

    req.debtorId = debtor.id;
    next();
  } catch (err) {
    res.status(500).json({
      errors: {
        msg: "Ocorreu um erro no servidor",
      },
    });
  }
};

module.exports = getuserid;
