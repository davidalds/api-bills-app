const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authentication");
const checkuser = require("../middlewares/checkuser");
const CreditorsControllers = require("../controllers/CreditorsControllers");

const {
  createCreditorSchema,
  updateCreditorSchema,
} = require("../middlewares/schemas/creditorSchemas");

router.get(
  "/creditors/:debtorId",
  auth,
  checkuser,
  CreditorsControllers.getCreditors
);
router.get(
  "/creditor/:debtorId/:creditorId",
  auth,
  checkuser,
  CreditorsControllers.getCreditor
);

router.post(
  "/creditor/",
  auth,
  createCreditorSchema,
  CreditorsControllers.createCreditor
);

router.patch(
  "/creditor/:debtorId/:creditorId",
  auth,
  updateCreditorSchema,
  CreditorsControllers.updateCreditor
);

module.exports = router;
