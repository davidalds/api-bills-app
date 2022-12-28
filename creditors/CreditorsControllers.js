const express = require("express");
const router = express();

const Creditor = require("./Creditor");
const Debt = require("../debts/Debt");

const auth = require("../middlewares/authentication");
const checkuser = require("../middlewares/checkuser");

const { check, body, validationResult } = require("express-validator");

router.get("/creditors/:debtorId/", auth, checkuser, async (req, res) => {
  try {
    const { debtorId } = req.params;
    const [limit, offset] = [
      parseInt(req.query["limit"]),
      parseInt(req.query["offset"]),
    ];
    const creditors = await Creditor.findAndCountAll({
      where: { DebtorId: parseInt(debtorId) },
      limit: limit || undefined,
      offset: offset || undefined,
    });
    res.status(200).json(creditors);
  } catch (err) {
    res.status(500).json({
      errors: {
        msg: "Ocorreu um erro ao obter lista de credores",
      },
    });
  }
});

router.get(
  "/creditor/:debtorId/:creditorId",
  auth,
  checkuser,
  async (req, res) => {
    try {
      const { debtorId, creditorId } = req.params;
      const creditor = await Creditor.findByPk(creditorId);

      if (!creditor) {
        return res.status(200).json([]);
      }

      if (creditor.DebtorId !== parseInt(debtorId)) {
        return res.status(400).json({
          errors: {
            msg: "Acesso negado",
          },
        });
      }

      const total_price_debts = await Debt.sum("price", {
        where: { CreditorId: creditor.id },
      });

      res.status(200).json({ creditor, total_price_debts });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao obter dados do credor",
        },
      });
    }
  }
);

router.post(
  "/creditor",
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
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, creditor_type, DebtorId } = req.body;

      await Creditor.create({
        name,
        email: email ? email : null,
        creditor_type,
        DebtorId,
      });

      res.status(200).json({
        msg: "Credor registrado com sucesso",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao registrar credor",
        },
      });
    }
  }
);

module.exports = router;
