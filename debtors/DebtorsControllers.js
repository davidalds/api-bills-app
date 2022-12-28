const express = require("express");
const router = express.Router();

// Debtor model
const Debtor = require("./Debtor");

// Bcrypt
const bcrypt = require("bcryptjs");

// Validate fields
const { check, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const Creditor = require("../creditors/Creditor");
const Debt = require("../debts/Debt");
const auth = require("../middlewares/authentication");
const checkUser = require("../middlewares/checkuser");

router.get("/debtors", async (req, res) => {
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
});

router.get("/debtor/:debtorId",auth, checkUser, async (req, res) => {
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

    res.status(200).json({count_creditors, count_debts, total_price_debts});
  } catch {
    res.status(500).json({
      errors: {
        msg: "Ocorreu um erro ao obter informações do usuário",
      },
    });
  }
});

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
  async (req, res) => {
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
);

router.post(
  "/login",
  [
    check("email").notEmpty().withMessage("Campo e-mail é obrigatório"),
    check("password").notEmpty().withMessage("Campo senha é obrigatório"),
  ],
  async (req, res) => {
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
);

module.exports = router;
