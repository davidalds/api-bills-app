const express = require("express");
const router = express.Router();

// Debtor model
const Debtor = require("../models/Debtor");

// Bcrypt
const bcrypt = require("bcryptjs");

// Validate fields
const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const Creditor = require("../models/Creditor");
const Debt = require("../models/Debt");

class DebtorsControllers {
  async getDebtors(req, res) {
    try {
      const debtors = await Debtor.findAll({
        attributes: { exclude: ["password"] },
      });
      res.status(200).json(debtors);
    } catch {
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao obter lista de devedores",
        },
      });
    }
  }

  async getDebtor(req, res) {
    try {
      const { debtorId } = req.params;

      const count_creditors = await (
        await Creditor.findAndCountAll({ where: { DebtorId: debtorId } })
      ).count;
      const count_debts = await (
        await Debt.findAndCountAll({ where: { DebtorId: debtorId } })
      ).count;
      const total_price_debts = await Debt.sum("price", {
        where: { DebtorId: debtorId },
      });
      const payed_debts = await (
        await Debt.findAndCountAll({
          where: { status: "Paga", DebtorId: debtorId },
        })
      ).count;
      const open_debts = await (
        await Debt.findAndCountAll({
          where: { status: "Devendo", DebtorId: debtorId },
        })
      ).count;

      res.status(200).json({
        count_creditors,
        count_debts,
        total_price_debts,
        payed_debts,
        open_debts,
      });
    } catch {
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao obter informações do usuário",
        },
      });
    }
  }

  async createDebtor(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      await Debtor.create({ name, email, password: hash });

      res.status(200).json({
        msg: "Devedor cadastrado com sucesso",
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao registrar devedor",
        },
      });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await Debtor.findOne({ where: { email: email } });

      if (!user) {
        return res
          .status(400)
          .json({ errors: { msg: "Credenciais inválidas" } });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(400)
          .json({ errors: { msg: "Credenciais inválidas" } });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.PRIVATE_KEY,
        { expiresIn: "24h" }
      );

      res.status(200).json({ access_token: token });
    } catch (err) {
      res.status(500).json({
        errors: {
          msg: "Ocorreu um erro ao realizar login",
        },
      });
    }
  }
}

module.exports = new DebtorsControllers();
