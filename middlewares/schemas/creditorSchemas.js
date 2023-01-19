const Creditor = require("../../models/Creditor");
const { check } = require("express-validator");

exports.createCreditorSchema = [
  check("name").trim().notEmpty().withMessage("Nome é um campo obrigatório"),
  check("email")
    .if(check("email").exists().notEmpty())
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
];

exports.updateCreditorSchema = [
  check("name")
    .if(check("name").exists())
    .trim()
    .notEmpty()
    .withMessage("Nome é um campo obrigatório"),
  check("email")
    .if(check("email").exists().notEmpty())
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
];
