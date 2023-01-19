const Debtor = require("../../models/Debtor");
const { check } = require("express-validator");

exports.createDebtorSchema = [
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
];

exports.loginDebtorSchema = [
  check("email")
    .notEmpty()
    .withMessage("Campo e-mail é obrigatório")
    .isEmail()
    .withMessage("O e-mail deve ser válido"),
  check("password").notEmpty().withMessage("Campo senha é obrigatório"),
];

exports.recoverPasswordSchema = [
  check("email")
    .notEmpty()
    .withMessage("Campo e-mail é obrigatório")
    .isEmail()
    .withMessage("O e-mail deve ser válido"),
];

exports.changePasswordSchema = [
  check("token").notEmpty().withMessage("Token é obrigatório"),
  check("password").notEmpty().withMessage("Campo senha é obrigatório"),
];
