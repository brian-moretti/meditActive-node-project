const express = require("express");
const app = express();

const router = require("./Core/Router");

app.use(express.static("public"));
app.use(express.json());
app.use(router);

app.listen(3000);
