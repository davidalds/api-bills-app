const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authentication");
const checkuser = require("../middlewares/checkuser");
const CreditorsControllers = require("../controllers/CreditorsControllers");

const {
  createCreditorSchema,
  updateCreditorSchema,
} = require("../middlewares/schemas/creditorSchemas");
const getuserid = require("../middlewares/getuserid");

router.get(
  "/creditors/:debtorUid",
  auth,
  checkuser,
  getuserid,
  CreditorsControllers.getCreditors
);
router.get(
  "/creditor/:debtorUid/:creditorId",
  auth,
  checkuser,
  getuserid,
  CreditorsControllers.getCreditor
);

router.post(
  "/creditor/",
  auth,
  createCreditorSchema,
  CreditorsControllers.createCreditor
);

router.patch(
  "/creditor/:debtorUid/:creditorId",
  auth,
  checkuser,
  getuserid,
  updateCreditorSchema,
  CreditorsControllers.updateCreditor
);

router.delete(
  "/creditor/:debtorUid/:creditorId",
  auth,
  checkuser,
  getuserid,
  CreditorsControllers.deleteCredor
);

module.exports = router;
