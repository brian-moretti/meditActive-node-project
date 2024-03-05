const sinon = require("sinon");
const { expect } = require("chai");
const User = require("../project-mysql/App/models/user");
const usersController = require("../project-mysql/App/controllers/usersController");
const mySql = require("mysql2/promise");

describe("testing user model", () => {
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
      const query = `SELECT * FROM ${User.tableName}`;
      const fakeQueryResult = [
        { id: 1, name: "John", surname: "Doe", email: "johndoe@test.com" },
      ];
      connectAndQueryStub.resolves(fakeQueryResult);
      createConnectionStub.returns({
        query: connectAndQueryStub,
        end: sinon.stub().resolves(),
      });
      const result = await User.getAll();
      expect(connectAndQueryStub.calledOnce).to.be.true;
      expect(connectAndQueryStub.calledOnceWith(query)).to.be.true;
      expect(result).to.deep.equal(fakeQueryResult[0]);
    });
  });

  describe("testing getUser", () => {
    it("testing on success", async () => {
      const query = `SELECT * FROM ${User.tableName} WHERE id = ?`;
      const id = 1;
      const fakeQueryResult = [
        { id: 1, name: "John", surname: "Doe", email: "johndoe@test.com" },
      ];
      connectAndQueryStub.resolves(fakeQueryResult);
      createConnectionStub.returns({
        query: connectAndQueryStub,
        end: sinon.stub().resolves(),
      });
      const result = await User.getUser(id);
      expect(connectAndQueryStub.calledOnce).to.be.true;
      expect(connectAndQueryStub.calledOnceWith(query)).to.be.true;
      expect(result).to.deep.equal(fakeQueryResult[0]);
    });
  });
});

describe("testing user_index controller function", () => {
  let req, res, getAllStub;
  beforeEach(() => {
    req = {};
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    getAllStub = sinon.stub(User, "getAll");
  });
  afterEach(() => {
    getAllStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = [
      { id: 1, name: "John", surname: "Doe", email: "johndoe@test.com" },
    ];
    getAllStub.resolves(fakeQueryResult);
    await usersController.user_index(req, res);
    expect(getAllStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({ Users: fakeQueryResult })).to.be.true;
  });
  it("handle error", async () => {
    const error = { Error: "Internal server errors" };
    getAllStub.rejects(error);
    await usersController.user_index(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});

describe("testing user_details controller function", () => {
  let req, res, getUserStub;
  beforeEach(() => {
    req = { params: { id: 1 } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    getUserStub = sinon.stub(User, "getUser");
  });
  afterEach(() => {
    getUserStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = [
      { id: 1, name: "John", surname: "Doe", email: "johndoe@test.com" },
    ];
    getUserStub.resolves(fakeQueryResult);
    await usersController.user_details(req, res);
    expect(getUserStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({ User: fakeQueryResult })).to.be.true;
  });
  it("testing on user not founded", async () => {
    const fakeQueryResult = [];
    const userNotFound = { Error: "User not founded" };
    getUserStub.resolves(fakeQueryResult);
    await usersController.user_details(req, res);
    expect(getUserStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(404)).to.be.true;
    expect(res.json.calledOnceWith(userNotFound));
  });
  it("handle error", async () => {
    const error = { Error: "Internal server errors" };
    getUserStub.rejects(error);
    await usersController.user_details(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});
describe("testing user_create controller function", () => {
  let req, res, createUserStub;
  beforeEach(() => {
    req = {
      body: { name: "John", surname: "Doe", email: "johndoe@test.com" },
    };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    createUserStub = sinon.stub(User, "createUser");
  });
  afterEach(() => {
    createUserStub.restore();
  });
  it("testing on success", async () => {
    const fakeQueryResult = { insertId: 1 };
    createUserStub.resolves(fakeQueryResult);
    await usersController.user_create(req, res);
    expect(createUserStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(201)).to.be.true;
    expect(
      res.json.calledOnceWith({ ID: fakeQueryResult.insertId, User: req.body })
    ).to.be.true;
  });
  it("handle Body error", async () => {
    const bodyError = { Error: "The body is not correct" };
    const messageError = { message: "Body" };
    createUserStub.rejects(messageError);
    await usersController.user_create(req, res);
    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith(bodyError));
  });
  it("handle duplicate email error", async () => {
    const emailError = { Error: "Email already exists" };
    const codeError = { code: "ER_DUP_ENTRY" };
    createUserStub.rejects(codeError);
    await usersController.user_create(req, res);
    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith(emailError));
  });
  it("handle errors", async () => {
    const error = { Error: "Internal server errors" };
    createUserStub.rejects(error);
    await usersController.user_create(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});

describe("testing user_update controller function", () => {
  let req, res, fakeUpdatedUser, updateUserStub, userToUpdateStub;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: { name: "John", surname: "Doe", email: "johndoe@test.com" },
    };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    fakeUpdatedUser = {
      id: 1,
      name: "John",
      surname: "Doe",
      email: "johndoe@test.com",
    };
    updateUserStub = sinon.stub(User, "updateUser");
    userToUpdateStub = sinon.stub(User, "getUser");
  });
  afterEach(() => {
    updateUserStub.restore();
    userToUpdateStub.restore();
  });
  it("testing user_update on success", async () => {
    const fakeQueryResult = { affectedRows: 1 };
    userToUpdateStub.resolves([fakeUpdatedUser]);
    updateUserStub.resolves(fakeQueryResult);
    await usersController.user_update(req, res);
    expect(updateUserStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(
      res.json.calledOnceWith({
        "Update ID": userToUpdateStub.id,
        "data updated": req.body,
      })
    );
  });
  it("handle duplicate email error", async () => {
    const emailError = { Error: "Email already exists" };
    const codeError = { code: "ER_DUP_ENTRY" };
    userToUpdateStub.resolves([fakeUpdatedUser]);
    updateUserStub.rejects(codeError);
    await usersController.user_update(req, res);
    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith(emailError));
  });
  it("handle errors", async () => {
    const error = { Error: "Internal server errors" };
    userToUpdateStub.resolves([fakeUpdatedUser]);
    updateUserStub.rejects(error);
    await usersController.user_update(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});

describe("testing user_delete controller function", () => {
  let req, res, deleteUserStub, fakeDeletedUser;

  beforeEach(() => {
    req = { params: { id: 1 } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    deleteUserStub = sinon.stub(User, "deleteUser");
    fakeDeletedUser = {
      id: 1,
      name: "John",
      surname: "Doe",
      email: "johndoe@test.com",
    };
  });

  afterEach(() => {
    deleteUserStub.restore();
  });

  it("testing user_delete on success", async () => {
    const fakeQueryResult = { affectedRows: 1 };
    deleteUserStub.resolves([fakeQueryResult, fakeDeletedUser]);
    await usersController.user_delete(req, res);
    expect(deleteUserStub.calledOnce).to.be.true;
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({ "user deleted": fakeDeletedUser }));
  });

  it("testing user_delete with user not founded", async () => {
    const error = { Error: "User not founded" };
    const fakeQueryResult = { affectedRows: 0 };
    deleteUserStub.resolves([fakeQueryResult, fakeDeletedUser]);
    await usersController.user_delete(req, res);
    expect(res.status.calledOnceWith(404)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });

  it("handle user_delete error", async () => {
    const error = { Error: "Internal server errors" };
    deleteUserStub.rejects(error);
    await usersController.user_delete(req, res);
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith(error));
  });
});
