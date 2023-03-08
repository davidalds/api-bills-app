const express = require("express");
const router = express.Router();

const debtsControllers = require("../controllers/DebtsControllers");
const DebtsControllers = require("../controllers/DebtsControllers");

const auth = require("../middlewares/authentication");
const checkUser = require("../middlewares/checkuser");
const getuserid = require("../middlewares/getuserid");

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
router.post("/debt", auth, debtsControllers.createDebt);
router.patch(
  "/debt/:debtorUid/:debtId",
  auth,
  getuserid,
  debtsControllers.updateDebt
);

module.exports = router;
