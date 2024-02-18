const sinon = require("sinon");
const { expect } = require("chai");
const Interval = require("../App/models/interval-target");
const intervalTargetController = require("../App/controllers/intervalTargetController");

describe("testing interval_index controller function", () => {
  let req, res, getAllStub;
  beforeEach(() => {
    req = {};
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    getAllStub = sinon.stub(Interval, "getAll");
  });
  afterEach(() => {
    getAllStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = [
      {
        title: "goal title",
        description: "goal description",
        date_start: "2024-01-01",
        date_end: "2024-01-31",
        user_id: 1,
        name: "username",
        surname: "surname",
        email: "email",
      },
    ];
    getAllStub.resolves(fakeQueryResult);
    await intervalTargetController.intervalTarget_index(req, res);
    expect(getAllStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({ Interval: fakeQueryResult })).to.be.true;
  });
  it("handle date error", async () => {
    const error = {
      "Date Error": "There is an error on the Date, please check",
    };
    const dateError = { message: "Date" };
    getAllStub.rejects(dateError);
    await intervalTargetController.intervalTarget_index(req, res);
    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
  it("handle server error", async () => {
    const error = { Error: "Internal server errors" };
    getAllStub.rejects(error);
    await intervalTargetController.intervalTarget_index(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});

describe("testing interval_details controller function", () => {
  let req, res, getIntervalStub;
  beforeEach(() => {
    req = { params: { id: 1 } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    getIntervalStub = sinon.stub(Interval, "getIntervalTarget");
  });
  afterEach(() => {
    getIntervalStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = [
      {
        title: "goal title",
        description: "goal description",
        date_start: "2024-01-01",
        date_end: "2024-01-31",
        user_id: 1,
        name: "username",
        surname: "surname",
        email: "email",
      },
    ];
    getIntervalStub.resolves(fakeQueryResult);
    await intervalTargetController.intervalTarget_details(req, res);
    expect(getIntervalStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({ Interval: fakeQueryResult })).to.be.true;
  });
  it("testing on intervval not founded", async () => {
    const fakeQueryResult = [];
    const intervalNotFounded = { Error: "Interval not founded" };
    getIntervalStub.resolves(fakeQueryResult);
    await intervalTargetController.intervalTarget_details(req, res);
    expect(getIntervalStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(404)).to.be.true;
    expect(res.json.calledOnceWith(intervalNotFounded));
  });
  it("handle error", async () => {
    const error = { Error: "Internal server errors" };
    getIntervalStub.rejects(error);
    await intervalTargetController.intervalTarget_details(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});

describe("testing interval_create controller function", () => {
  let req, res, createIntervalStub;
  beforeEach(() => {
    req = {
      body: {
        date_start: "2024-01-01",
        date_end: "2024-01-31",
        user_id: 1,
        goal_id: 1,
      },
    };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    createIntervalStub = sinon.stub(Interval, "createIntervalTarget");
  });
  afterEach(() => {
    createIntervalStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = { insertId: 1 };
    createIntervalStub.resolves(fakeQueryResult);
    await intervalTargetController.intervalTarget_create(req, res);
    expect(createIntervalStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(201)).to.be.true;
    expect(
      res.json.calledOnceWith({
        ID: fakeQueryResult.insertId,
        Interval: req.body,
      })
    ).to.be.true;
  });
  it("handle Body error", async () => {
    const bodyError = { Error: "The body is not correct" };
    const messageError = { message: "Body" };
    createIntervalStub.rejects(messageError);
    await intervalTargetController.intervalTarget_create(req, res);
    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith(bodyError));
  });
  it("handle errors", async () => {
    const error = { Error: "Internal server errors" };
    createIntervalStub.rejects(error);
    await intervalTargetController.intervalTarget_create(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});

describe("testing interval_update controller function", () => {
  let req, res, updateIntervalStub, intervalToUpdateStub, fakeIntervalUpdated;
  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: {
        id: 1,
        date_start: "2024-01-01",
        date_end: "2024-01-31",
        goal_id: 1,
      },
    };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    updateIntervalStub = sinon.stub(Interval, "updateIntervalTarget");
    intervalToUpdateStub = sinon.stub(Interval, "getIntervalTarget");
    fakeIntervalUpdated = [
      {
        id: 1,
        date_start: "2024-01-01",
        date_end: "2024-01-31",
        user_id: 1,
        name: "username",
        surname: "surname",
        email: "email",
        goal_id: 1,
        title: "goal title",
        description: "goal description",
      },
    ];
  });
  afterEach(() => {
    updateIntervalStub.restore();
    intervalToUpdateStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = { affectedRows: 1 };
    intervalToUpdateStub.resolves([fakeIntervalUpdated]);
    updateIntervalStub.resolves(fakeQueryResult);
    await intervalTargetController.intervalTarget_update(req, res);
    expect(updateIntervalStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(
      res.json.calledOnceWith({
        "Update ID": intervalToUpdateStub.id,
        "Interval updated": req.body,
      })
    );
  });
  it("handle Body Error", async () => {
    const bodyError = { Error: "The body is not correct" };
    const messageError = { message: "Body" };
    intervalToUpdateStub.resolves([fakeIntervalUpdated]);
    updateIntervalStub.rejects(messageError);
    await intervalTargetController.intervalTarget_update(req, res);
    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith(bodyError));
  });
  it("handle error", async () => {
    const error = { Error: "Internal server errors" };
    intervalToUpdateStub.resolves([fakeIntervalUpdated]);
    updateIntervalStub.rejects(error);
    await intervalTargetController.intervalTarget_update(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});

describe("testing interval_delete controller function", () => {
  let req, res, deleteIntervalStub, fakeDeletedInterval;
  beforeEach(() => {
    req = { params: { id: 1 } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    deleteIntervalStub = sinon.stub(Interval, "deleteIntervalTarget");
    fakeDeletedInterval = {
      id: 1,
      date_start: "2024-01-01",
      date_end: "2024-01-31",
      user_id: 1,
      name: "username",
      surname: "surname",
      email: "email",
      goall_id: 1,
      title: "goal title",
      description: "goal description",
    };
  });
  afterEach(() => {
    deleteIntervalStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = { affectedRows: 1 };
    deleteIntervalStub.resolves([fakeQueryResult, fakeDeletedInterval]);
    await intervalTargetController.intervalTarget_delete(req, res);
    expect(deleteIntervalStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({ "ID Deleted": fakeDeletedInterval }));
  });
  it("handle interval not founded error", async () => {
    const error = { Error: "Interval not founded" };
    const fakeQueryResult = { affectedRows: 0 };
    deleteIntervalStub.resolves([fakeQueryResult, fakeDeletedInterval]);
    await intervalTargetController.intervalTarget_delete(req, res);
    expect(res.status.calledOnceWith(404)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });

  it("handle error", async () => {
    const error = { Error: "Internal server errors" };
    deleteIntervalStub.rejects(error);
    await intervalTargetController.intervalTarget_delete(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});
