const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const Debtor = require("./Debtor");

const PasswordTokens = sequelize.define("PasswordTokens", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usedToken: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Debtor.hasMany(PasswordTokens);
PasswordTokens.belongsTo(Debtor);

(async () => {
  await PasswordTokens.sync({ force: false });
})();

module.exports = PasswordTokens;
