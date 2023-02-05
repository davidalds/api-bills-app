const Creditor = require("../models/Creditor");
const Debt = require("../models/Debt");

const { validationResult } = require("express-validator");

class CreditorsControllers {
  async getCreditors(req, res) {
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
  }

  async getCreditor(req, res) {
    try {
      const { debtorId, creditorId } = req.params;
      const creditor = await Creditor.findByPk(creditorId);

      if (!creditor) {
        return res.status(200).json([]);
      }

      if (creditor.DebtorId !== parseInt(debtorId)) {
        return res.status(401).json({
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

  async createCreditor(req, res) {
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

  async updateCreditor(req, res) {
    try {
      const { debtorId, creditorId } = req.params;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const body = req.body;

      if (!body) {
        return res.status(400).json({
          errors: {
            msg: "Informe dados para serem alterados no credor",
          },
        });
      }

      const result = await Creditor.update(
        { ...body },
        { where: { id: creditorId, DebtorId: debtorId } }
      );

      if (!result[0]) {
        return res.status(400).json({
          errors: {
            msg: "Não foram encontrados credores com as informações passadas",
          },
        });
      }

      res.status(200).json({ msg: "Credor alterado" });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao editar credor",
        },
      });
    }
  }

  async deleteCredor(req, res) {
    try {
      const { debtorId, creditorId } = req.params;

      const creditor = await Creditor.findByPk(creditorId);

      if (!creditor) {
        return res.status(404).json({
          errors: {
            msg: "Não foram encontrados credores com o ID informado",
          },
        });
      }

      if (!(creditor.DebtorId == debtorId)) {
        return res.status(401).json({
          errors: {
            msg: "Você não possui permissão para excluir o credor",
          },
        });
      }

      await Creditor.destroy({ where: { id: creditorId } });
      res.status(200).json({ msg: "Credor excluído com sucesso" });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao deletar credor",
        },
      });
    }
  }
}

module.exports = new CreditorsControllers();
