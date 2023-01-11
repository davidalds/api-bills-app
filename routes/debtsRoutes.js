const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const debtsControllers = require("../controllers/DebtsControllers");
const DebtsControllers = require("../controllers/DebtsControllers");

const auth = require("../middlewares/authentication");
const checkUser = require("../middlewares/checkuser");

router.get(
  "/debts/:debtorId/:creditorId?",
  auth,
  checkUser,
  DebtsControllers.getDebts
);
router.get(
  "/debt/:debtorId/:debtId",
  auth,
  checkUser,
  DebtsControllers.getDebt
);
router.post(
  "/debt",
  [
    check("title")
      .trim()
      .notEmpty()
      .withMessage("Título é um campo obrigatório"),
    check("payday")
      .trim()
      .notEmpty()
      .withMessage("Data de pagamento é um campo obrigatório")
      .isDate()
      .withMessage("Data de pagamento não é válida"),
    check("price")
      .notEmpty()
      .withMessage("Valor da dívida é um campo obrigatório")
      .isNumeric()
      .withMessage("Valor da dívida dever ser númerico"),
    check("DebtorId")
      .notEmpty()
      .withMessage("Campo de devedor é obrigatório")
      .isNumeric()
      .withMessage("Campo do devedor deve ser númerico"),
    check("CreditorId")
      .notEmpty()
      .withMessage("Campo de credor é obrigatório")
      .isNumeric()
      .withMessage("Campo do credor deve ser númerico"),
  ],
  auth,
  debtsControllers.createDebt
);
router.patch(
  "/debt/:debtorId/:debtId",
  [
    check("title")
      .if(check("title").exists())
      .trim()
      .notEmpty()
      .withMessage("Título é um campo obrigatório"),
    check("payday")
      .if(check("payday").exists())
      .trim()
      .notEmpty()
      .withMessage("Data de pagamento é um campo obrigatório")
      .isDate()
      .withMessage("Data de pagamento não é válida"),
    check("price")
      .if(check("price").exists())
      .notEmpty()
      .withMessage("Valor da dívida é um campo obrigatório")
      .isNumeric()
      .withMessage("Valor da dívida dever ser númerico"),
    check("CreditorId")
      .if(check("CreditorId").exists())
      .notEmpty()
      .withMessage("Campo de credor é obrigatório")
      .isNumeric()
      .withMessage("Campo do credor deve ser númerico"),
  ],
  auth,
  debtsControllers.updateDebt
);

module.exports = router;
