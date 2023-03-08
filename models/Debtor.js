const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection");

const Debtor = sequelize.define("Debtor", {
  uid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5],
    },
  },
});

(async () => {
  await Debtor.sync({ force: false });
})();

module.exports = Debtor;
