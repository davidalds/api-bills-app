const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection");

const Debtor = require("../debtors/Debtor");

const Creditor = sequelize.define("Creditor", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING,
    unique: true
  },
  creditor_type: {
    type: DataTypes.ENUM,
    values: ["Fisico", "Juridico"],
    allowNull: false,
  },
});

Debtor.hasMany(Creditor);
Creditor.belongsTo(Debtor);

(async () => {
  await Creditor.sync({ force: false });
})();

module.exports = Creditor;
