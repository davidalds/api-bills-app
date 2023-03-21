const express = require("express");
const router = express.Router();

const debtsControllers = require("../controllers/DebtsControllers");
const DebtsControllers = require("../controllers/DebtsControllers");

const auth = require("../middlewares/authentication");
const checkUser = require("../middlewares/checkuser");
const getuserid = require("../middlewares/getuserid");

const {
  createDebtSchema,
  updateDebtSchema,
} = require("../middlewares/schemas/debtSchemas");

router.get(
  "/debts/notify/:debtorUid",
  auth,
  checkUser,
  getuserid,
  debtsControllers.notifyDebts
);
router.get(
  "/debts/:debtorUid/:creditorId?",
  auth,
  checkUser,
  getuserid,
  DebtsControllers.getDebts
);
router.get(
  "/debt/:debtorUid/:debtId",
  auth,
  checkUser,
  getuserid,
  DebtsControllers.getDebt
);
router.post("/debt", auth, createDebtSchema, debtsControllers.createDebt);
router.patch(
  "/debt/:debtorUid/:debtId",
  auth,
  getuserid,
  updateDebtSchema,
  debtsControllers.updateDebt
);

module.exports = router;
