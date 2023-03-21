const Debt = require("../models/Debt");
const Creditor = require("../models/Creditor");
const Debtor = require("../models/Debtor");

const { validationResult } = require("express-validator");
const compareDates = require("../utils/compareDates");

class DebtsControllers {
  async getDebts(req, res) {
    try {
      const { creditorId } = req.params;
      const { debtorId } = req;

      const [limit, offset] = [
        parseInt(req.query["limit"]),
        parseInt(req.query["offset"]),
      ];
      const statusFilter = req.query["status"];

      let debts = [];
      if (!creditorId) {
        debts = await Debt.findAndCountAll({
          limit: limit || undefined,
          offset: offset || undefined,
          where: statusFilter
            ? { DebtorId: debtorId, status: statusFilter }
            : { DebtorId: debtorId },
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

        if (creditor.DebtorId !== debtorId) {
          return res.status(400).json({
            errors: {
              msg: "Acesso negado",
            },
          });
        }

        debts = await Debt.findAndCountAll({
          limit: limit || undefined,
          offset: offset || undefined,
          where: {
            DebtorId: debtorId,
            CreditorId: creditorId,
          },
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

  async getDebt(req, res) {
    try {
      const { debtId } = req.params;
      const { debtorId } = req;

      const debt = await Debt.findByPk(debtId, {
        include: {
          model: Creditor,
        },
      });

      if (!debt) {
        return res.status(200).json([]);
      }

      if (debt.DebtorId !== debtorId) {
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
  }

  async createDebt(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        description,
        debtday,
        payday,
        price,
        DebtorId,
        CreditorId,
      } = req.body;

      await Debt.create({
        title,
        description,
        debtday,
        payday,
        status: "Devendo",
        price,
        DebtorId,
        CreditorId,
      });

      res.status(200).json({
        msg: "Dívida cadastrada com sucesso",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao registrar devedor",
        },
      });
    }
  }

  async updateDebt(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { debtId } = req.params;
      const { debtorId } = req;

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
  }

  async notifyDebts(req, res) {
    try {
      const { debtorId } = req;

      const debts = await Debt.findAll({
        where: { DebtorId: debtorId, status: "Devendo" },
        attributes: ["id", "title", "payday"],
      });

      const res_debts = debts.filter((debt) => compareDates(debt.payday));
      const total = res_debts.length;

      res.status(200).json({
        total,
        debts: res_debts,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao obter a notificação de dívidas",
        },
      });
    }
  }
}

module.exports = new DebtsControllers();
