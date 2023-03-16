const { check } = require("express-validator");

exports.createDebtSchema = [
  check("title").trim().notEmpty().withMessage("Título é um campo obrigatório"),
  check("debtday")
    .trim()
    .notEmpty()
    .withMessage("Data do débito é um campo obrigatório")
    .isDate()
    .withMessage("Data de débito não é válida"),
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
];

exports.updateDebtSchema = [
  check("title")
    .if(check("title").exists())
    .trim()
    .notEmpty()
    .withMessage("Título é um campo obrigatório"),
  check("debtday")
    .if(check("debtday").exists())
    .trim()
    .notEmpty()
    .withMessage("Data do débito é um campo obrigatório")
    .isDate()
    .withMessage("Data de débito não é válida"),
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
];
