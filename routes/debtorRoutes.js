const express = require("express");
const router = express.Router();

const Debtor = require("../models/Debtor");

const auth = require("../middlewares/authentication");
const checkUser = require("../middlewares/checkuser");

const { check } = require("express-validator");
const DebtorsControllers = require("../controllers/DebtorsControllers");

router.get("/debtor/:debtorId", auth, checkUser, DebtorsControllers.getDebtor);
router.post(
  "/debtor",
  [
    check("name", "Nome é um campo obrigatório").trim().notEmpty(),
    check("email")
      .trim()
      .notEmpty()
      .withMessage("E-mail é um campo obrigatório")
      .isEmail()
      .withMessage("O e-mail deve ser válido")
      .custom((email_value) => {
        return Debtor.findOne({ where: { email: email_value } }).then(
          (debtor) => {
            if (debtor) {
              return Promise.reject(
                "Já existe um devedor cadastrado com esse e-mail"
              );
            }
          }
        );
      }),
    check("password")
      .trim()
      .notEmpty()
      .withMessage("Senha é um campo obrigatório")
      .isLength({ min: 5 })
      .withMessage("A senha deve possuir no mínimo 5 caracteres"),
  ],
  DebtorsControllers.createDebtor
);
router.post(
  "/login",
  [
    check("email").notEmpty().withMessage("Campo e-mail é obrigatório"),
    check("password").notEmpty().withMessage("Campo senha é obrigatório"),
  ],
  DebtorsControllers.login
);

module.exports = router;
