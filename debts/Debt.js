const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection");

// associations models
const Creditor = require("../creditors/Creditor");
const Debtor = require("../debtors/Debtor");

const Debt = sequelize.define("Debt", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  payday: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ["Paga", "Devendo", "Cancelada"],
    allowNull: false
  },
});

// Debtor and Debt association
Debtor.hasMany(Debt);
Debt.belongsTo(Debtor);

// Creditor and Debt association
Creditor.hasMany(Debt);
Debt.belongsTo(Creditor);

(async () => {
  await Debt.sync({ force: false });
})();

module.exports = Debt;
