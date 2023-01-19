const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authentication");
const checkUser = require("../middlewares/checkuser");

const DebtorsControllers = require("../controllers/DebtorsControllers");
const {
  createDebtorSchema,
  loginDebtorSchema,
  recoverPasswordSchema,
  changePasswordSchema,
} = require("../middlewares/schemas/debtorSchemas");

router.get("/debtor/:debtorId", auth, checkUser, DebtorsControllers.getDebtor);
router.post("/debtor", createDebtorSchema, DebtorsControllers.createDebtor);
router.post("/login", loginDebtorSchema, DebtorsControllers.login);
router.post(
  "/recover",
  recoverPasswordSchema,
  DebtorsControllers.recoverPassword
);
router.post(
  "/changePassword/",
  changePasswordSchema,
  DebtorsControllers.changePassword
);

module.exports = router;
