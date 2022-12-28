const express = require("express");
const router = express.Router();

const Debt = require("./Debt");
const Creditor = require("../creditors/Creditor");
const Debtor = require("../debtors/Debtor");

const { check, validationResult } = require("express-validator");

const auth = require("../middlewares/authentication");
const checkUser = require("../middlewares/checkuser");

router.get(
  "/debts/:debtorId/:creditorId?",
  auth,
  checkUser,
  async (req, res) => {
    try {
      const { debtorId, creditorId } = req.params;
      const [limit, offset] = [
        parseInt(req.query["limit"]),
        parseInt(req.query["offset"]),
      ];
      let debts = [];
      if (!creditorId) {
        debts = await Debt.findAndCountAll({
          limit: limit || undefined,
          offset: offset || undefined,
          where: { DebtorId: debtorId },
          include: [
            {
              model: Debtor,
              attributes: {
                exclude: ["password"],
              },
            },
            {
              model: Creditor,
            },
          ],
        });
      } else {
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

        debts = await Debt.findAndCountAll({
          limit: limit || undefined,
          offset: offset || undefined,
          where: { DebtorId: debtorId, CreditorId: creditorId },
        });
      }

      res.status(200).json(debts);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao obter lista de débitos",
        },
      });
    }
  }
);

router.post(
  "/debt",
  auth,
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
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, payday, price, DebtorId, CreditorId } =
        req.body;

      await Debt.create({
        title,
        description,
        payday,
        status: "Devendo",
        price,
        DebtorId,
        CreditorId,
      });

      res.status(200).json({
        msg: "Dívida cadastrada com sucesso",
      });
    } catch {
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao registrar devedor",
        },
      });
    }
  }
);

router.get("/debt/:debtorId/:debtId", auth, checkUser, async (req, res) => {
  try {
    const { debtorId, debtId } = req.params;

    const debt = await Debt.findByPk(debtId, {
      include: {
        model: Creditor,
      },
    });

    if (!debt) {
      return res.status(200).json([]);
    }

    if (debt.DebtorId !== parseInt(debtorId)) {
      return res.status(400).json({
        errors: {
          msg: "Acesso negado",
        },
      });
    }

    res.status(200).json(debt);
  } catch (err) {
    res.status(500).json({
      errors: {
        msg: "Ocorreu um erro ao buscar dívida",
      },
    });
  }
});

router.patch("/debt/:debtorId/:debtId", auth, checkUser, async (req, res) => {
  try {
    const { debtorId, debtId } = req.params;

    const body = req.body;

    if (!body) {
      return res.status(400).json({
        errors: {
          msg: "Informe dados para serem alterados na dívida",
        },
      });
    }

    const result = await Debt.update(
      { ...body },
      { where: { id: debtId, DebtorId: debtorId } }
    );

    if (!result[0]) {
      return res.status(400).json({
        errors: {
          msg: "Não foram encontras dívidas com as informações passadas",
        },
      });
    }

    res.status(200).json({
      msg: "Dívida alterada",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        msg: "Ocorreu um erro ao alterar informações da dívida",
      },
    });
  }
});

module.exports = router;
