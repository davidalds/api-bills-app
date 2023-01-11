const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authentication");
const checkuser = require("../middlewares/checkuser");
const { check, body, validationResult } = require("express-validator");
const CreditorsControllers = require("../controllers/CreditorsControllers");

const Creditor = require("../models/Creditor");

router.get(
  "/creditors/:debtorId",
  auth,
  checkuser,
  CreditorsControllers.getCreditors
);
router.get(
  "/creditor/:debtorId/:creditorId",
  auth,
  checkuser,
  CreditorsControllers.getCreditor
);
router.post(
  "/creditor/",
  auth,
  [
    check("name").trim().notEmpty().withMessage("Nome é um campo obrigatório"),
    check("email")
      .if(body("email").exists().notEmpty())
      .trim()
      .isEmail()
      .withMessage("O e-mail deve ser válido")
      .custom((email_value) => {
        return Creditor.findOne({ where: { email: email_value } }).then(
          (creditor) => {
            if (creditor) {
              return Promise.reject(
                "Já existe um credor cadastrado com esse e-mail"
              );
            }
          }
        );
      }),
    check("creditor_type")
      .notEmpty()
      .withMessage("Tipo do credor é um campo obrigatório")
      .isIn(["Fisico", "Juridico"])
      .withMessage("O valor informado é inválido"),
    check("DebtorId")
      .notEmpty()
      .withMessage("Campo de devedor é obrigatório")
      .isNumeric()
      .withMessage("Campo de credor deve ser númerico"),
  ],
  CreditorsControllers.createCreditor
);
router.patch(
  "/creditor/:debtorId/:creditorId",
  auth,
  [
    check("name")
      .if(check("name").exists())
      .trim()
      .notEmpty()
      .withMessage("Nome é um campo obrigatório"),
    check("email")
      .if(body("email").exists().notEmpty())
      .trim()
      .isEmail()
      .withMessage("O e-mail deve ser válido")
      .custom((email_value) => {
        return Creditor.findOne({ where: { email: email_value } }).then(
          (creditor) => {
            if (creditor && creditor.email !== email_value) {
              return Promise.reject(
                "Já existe um credor cadastrado com esse e-mail"
              );
            }
          }
        );
      }),
    check("creditor_type")
      .if(check("creditor_type").exists())
      .notEmpty()
      .withMessage("Tipo do credor é um campo obrigatório")
      .isIn(["Fisico", "Juridico"])
      .withMessage("O valor informado é inválido"),
  ],
  CreditorsControllers.updateCreditor
);

module.exports = router;
