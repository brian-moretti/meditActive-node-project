const express = require("express");
const app = express();
const router = require("./Core/Router");
const useDatabase = require("./Core/utilities/useDatabase");

app.use(express.static("public"));
app.use(express.json());

app.use((req, res, next) => {
  req.databaseModels = useDatabase();
  next();
});

app.use(router);
app.listen(3000);
