const express = require("express");
const router = express.Router();

const debtsControllers = require("../controllers/DebtsControllers");
const DebtsControllers = require("../controllers/DebtsControllers");

const auth = require("../middlewares/authentication");
const checkUser = require("../middlewares/checkuser");

router.get(
  "/debts/:debtorId/:creditorId?",
  auth,
  checkUser,
  DebtsControllers.getDebts
);
router.get(
  "/debt/:debtorId/:debtId",
  auth,
  checkUser,
  DebtsControllers.getDebt
);
router.post("/debt", auth, debtsControllers.createDebt);
router.patch("/debt/:debtorId/:debtId", auth, debtsControllers.updateDebt);

module.exports = router;
