require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

const connection = require("./database/connection");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const whitelist = process.env.WHITELIST.split(",");

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

(async () => {
  try {
    await connection.authenticate();
    console.log("Conexão com o banco estabelecida com sucesso");
  } catch (err) {
    console.log(err);
  }
})();

// models
const Debtor = require("./models/Debtor");
const Creditor = require("./models/Creditor");
const Debt = require("./models/Debt");

// routes
const debtorRoutes = require("./routes/debtorRoutes");
const creditorRoutes = require("./routes/creditorRoutes");
const debtRoutes = require('./routes/debtsRoutes')

app.use("/", debtorRoutes);
app.use("/", creditorRoutes);
app.use("/", debtRoutes);

app.listen(port, () => {
  console.log(`Api rodando na porta ${port}`);
});
