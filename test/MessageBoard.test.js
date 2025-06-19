const { expect } = require("chai");

describe("MessageBoard", function () {
  let messageBoard;
  let owner, user1;

  beforeEach(async function () {
    const MessageBoard = await ethers.getContractFactory("MessageBoard");
    messageBoard = await MessageBoard.deploy();
    await messageBoard.deployed();

    [owner, user1] = await ethers.getSigners();
  });

  it("사용자는 자신의 메시지를 저장할 수 있다", async function () {
    await messageBoard.connect(user1).setMessage("Hello, blockchain!");
    const message = await messageBoard.getMessage(user1.address);

    expect(message).to.equal("Hello, blockchain!");
  });

  it("각 사용자별 메시지가 독립적으로 저장된다", async function () {
    await messageBoard.connect(owner).setMessage("Owner's Message");
    await messageBoard.connect(user1).setMessage("User1's Message");

    const ownerMsg = await messageBoard.getMessage(owner.address);
    const user1Msg = await messageBoard.getMessage(user1.address);

    expect(ownerMsg).to.equal("Owner's Message");
    expect(user1Msg).to.equal("User1's Message");
  });
});
