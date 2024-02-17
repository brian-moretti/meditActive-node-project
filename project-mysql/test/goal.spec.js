const sinon = require("sinon");
const { expect } = require("chai");
const Goal = require("../App/models/goal");
const goalController = require("../App/controllers/goalController");
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
  it("testing on success", async () => {
    const query = `SELECT * FROM ${Goal.tableName}`;
    const fakeQueryResult = [
      { id: 1, title: "Goal Title", description: "Goal Description" },
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

describe("testing goal_index controller function", () => {
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
      { id: 1, title: "Goal Title", description: "Goal Description" },
    ];
    getAllStub.resolves(fakeQueryResult);
    await goalController.goal_index(req, res);
    expect(getAllStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({ goal: fakeQueryResult })).to.be.true;
  });
  it("handle error", async () => {
    const error = { Error: "Internal server errors" };
    getAllStub.rejects(error);
    await goalController.goal_index(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});
