async function chooseModel(req, model) {
  let database = Object.keys(req.databaseModels);
  return req.databaseModels[database][model];
}

module.exports = chooseModel;
