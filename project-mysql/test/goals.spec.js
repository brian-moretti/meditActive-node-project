const sinon = require("sinon");
const { expect } = require("chai");
const Goal = require("../App/models/goal");
const goalsController = require("../App/controllers/goalsController");
const mySql = require("mysql2/promise");

describe("testing goal model", () => {
  let connectAndQueryStub, createConnectionStub;
  beforeEach(() => {
    createConnectionStub = sinon.stub(mySql, "createConnection");
    connectAndQueryStub = sinon.stub();
  });
  afterEach(() => {
    createConnectionStub.restore();
  });
  describe("testing getAll", () => {
    it("testing on success", async () => {
      const query = `SELECT * FROM ${Goal.tableName}`;
      const fakeQueryResult = [
        { id: 1, title: "title", description: "description" },
      ];
      connectAndQueryStub.resolves(fakeQueryResult);
      createConnectionStub.returns({
        query: connectAndQueryStub,
        end: sinon.stub().resolves(),
      });
      const result = await Goal.getAll();
      expect(connectAndQueryStub.calledOnce).to.be.true;
      expect(connectAndQueryStub.calledOnceWith(query)).to.be.true;
      expect(result).to.deep.equal(fakeQueryResult[0]);
    });
  });

  describe("testing getGoal", () => {
    it("testing on success", async () => {
      const query = `SELECT * FROM ${Goal.tableName} WHERE id = ?`;
      const id = 1;
      const fakeQueryResult = [
        { id: 1, title: "title", description: "description" },
      ];
      connectAndQueryStub.resolves(fakeQueryResult);
      createConnectionStub.returns({
        query: connectAndQueryStub,
        end: sinon.stub().resolves(),
      });
      const result = await Goal.getGoal(id);
      expect(connectAndQueryStub.calledOnce).to.be.true;
      expect(connectAndQueryStub.calledOnceWith(query)).to.be.true;
      expect(result).to.deep.equal(fakeQueryResult[0]);
    });
  });
});

describe("testing Goal_index controller function", () => {
  let req, res, getAllStub;
  beforeEach(() => {
    req = {};
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    getAllStub = sinon.stub(Goal, "getAll");
  });
  afterEach(() => {
    getAllStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = [
      { id: 1, title: "title", description: "description" },
    ];
    getAllStub.resolves(fakeQueryResult);
    await goalsController.goal_index(req, res);
    expect(getAllStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({ Goal: fakeQueryResult })).to.be.true;
  });
  it("handle error", async () => {
    const error = { Error: "Internal server errors" };
    getAllStub.rejects(error);
    await goalsController.goal_index(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});

describe("testing Goal_details controller function", () => {
  let req, res, getGoalStub;
  beforeEach(() => {
    req = { params: { id: 1 } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    getGoalStub = sinon.stub(Goal, "getGoal");
  });
  afterEach(() => {
    getGoalStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = [
      { id: 1, title: "title", description: "description" },
    ];
    getGoalStub.resolves(fakeQueryResult);
    await goalsController.goal_details(req, res);
    expect(getGoalStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({ Goal: fakeQueryResult })).to.be.true;
  });
  it("testing on Goal not founded", async () => {
    const fakeQueryResult = [];
    const GoalNotFound = { Error: "Goal not founded" };
    getGoalStub.resolves(fakeQueryResult);
    await goalsController.goal_details(req, res);
    expect(getGoalStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(404)).to.be.true;
    expect(res.json.calledOnceWith(GoalNotFound));
  });
  it("handle error", async () => {
    const error = { Error: "Internal server errors" };
    getGoalStub.rejects(error);
    await goalsController.goal_details(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});
describe("testing Goal_create controller function", () => {
  let req, res, createGoalStub;
  beforeEach(() => {
    req = {
      body: { title: "title", description: "description" },
    };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    createGoalStub = sinon.stub(Goal, "createGoal");
  });
  afterEach(() => {
    createGoalStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = { insertId: 1 };
    createGoalStub.resolves(fakeQueryResult);
    await goalsController.goal_create(req, res);
    expect(createGoalStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(201)).to.be.true;
    expect(
      res.json.calledOnceWith({ ID: fakeQueryResult.insertId, Goal: req.body })
    ).to.be.true;
  });
  it("handle Body error", async () => {
    const bodyError = { Error: "The body is not correct" };
    const messageError = { message: "Body" };
    createGoalStub.rejects(messageError);
    await goalsController.goal_create(req, res);
    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith(bodyError));
  });
  it("handle errors", async () => {
    const error = { Error: "Internal server errors" };
    createGoalStub.rejects(error);
    await goalsController.goal_create(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});

describe("testing Goal_update controller function", () => {
  let req, res, fakeUpdatedGoal, updateGoalStub, GoalToUpdateStub;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: { title: "title", description: "description" },
    };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    fakeUpdatedGoal = {
      id: 1,
      title: "title",
      description: "description",
    };
    updateGoalStub = sinon.stub(Goal, "updateGoal");
    GoalToUpdateStub = sinon.stub(Goal, "getGoal");
  });
  afterEach(() => {
    updateGoalStub.restore();
    GoalToUpdateStub.restore();
  });
  it("testing Goal_update on success", async () => {
    const fakeQueryResult = { affectedRows: 1 };
    GoalToUpdateStub.resolves([fakeUpdatedGoal]);
    updateGoalStub.resolves(fakeQueryResult);
    await goalsController.goal_update(req, res);
    expect(updateGoalStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(
      res.json.calledOnceWith({
        "Update ID": GoalToUpdateStub.id,
        "data updated": req.body,
      })
    );
  });
  it("handle errors", async () => {
    const error = { Error: "Internal server errors" };
    GoalToUpdateStub.resolves([fakeUpdatedGoal]);
    updateGoalStub.rejects(error);
    await goalsController.goal_update(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});

describe("testing Goal_delete controller function", () => {
  let req, res, deleteGoalStub, fakeDeletedGoal;

  beforeEach(() => {
    req = { params: { id: 1 } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    deleteGoalStub = sinon.stub(Goal, "deleteGoal");
    fakeDeletedGoal = {
      id: 1,
      title: "title",
      description: "description",
    };
  });

  afterEach(() => {
    deleteGoalStub.restore();
  });

  it("testing Goal_delete on success", async () => {
    const fakeQueryResult = { affectedRows: 1 };
    deleteGoalStub.resolves([fakeQueryResult, fakeDeletedGoal]);
    await goalsController.goal_delete(req, res);
    expect(deleteGoalStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({ "Goal deleted": fakeDeletedGoal }));
  });

  it("testing Goal_delete with Goal not founded", async () => {
    const error = { Error: "Goal not founded" };
    const fakeQueryResult = { affectedRows: 0 };
    deleteGoalStub.resolves([fakeQueryResult, fakeDeletedGoal]);
    await goalsController.goal_delete(req, res);
    expect(res.status.calledOnceWith(404)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });

  it("handle Goal_delete error", async () => {
    const error = { Error: "Internal server errors" };
    deleteGoalStub.rejects(error);
    await goalsController.goal_delete(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});
