const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection");

// associations models
const Creditor = require("./Creditor");
const Debtor = require("./Debtor");

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
    allowNull: false,
  },
  payday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ["Paga", "Devendo", "Cancelada"],
    allowNull: false,
  },
});

// Debtor and Debt association
Debtor.hasMany(Debt);
Debt.belongsTo(Debtor);

// Creditor and Debt association
Creditor.hasMany(Debt, {
  onDelete: "SET NULL",
});
Debt.belongsTo(Creditor);

(async () => {
  await Debt.sync({ force: false });
})();

module.exports = Debt;
