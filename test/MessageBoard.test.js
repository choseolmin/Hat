const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MessageBoard", function () {
  let MessageBoard, messageBoard, owner, user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("MessageBoard");
    messageBoard = await factory.deploy();
    await messageBoard.waitForDeployment();
  });

  it("✅ 메시지를 게시하면 저장된다", async function () {
    await messageBoard.postMessage("First", "Hello, blockchain!");
    const messages = await messageBoard.getMessages(owner.address);

    expect(messages.length).to.equal(1);
    expect(messages[0].title).to.equal("First");
    expect(messages[0].body).to.equal("Hello, blockchain!");
    expect(messages[0].status).to.equal(0); // ACTIVE
  });

  it("✅ 다른 유저도 메시지를 독립적으로 저장한다", async function () {
    await messageBoard.connect(user1).postMessage("User1 Title", "User1 Body");
    const messages = await messageBoard.getMessages(user1.address);

    expect(messages.length).to.equal(1);
    expect(messages[0].title).to.equal("User1 Title");
  });

  it("✅ 메시지 개수 확인", async function () {
    await messageBoard.postMessage("T1", "B1");
    await messageBoard.postMessage("T2", "B2");

    const count = await messageBoard.getMessageCount(owner.address);
    expect(count).to.equal(2);
  });

  it("✅ 메시지를 아카이브하면 상태가 바뀐다", async function () {
    await messageBoard.postMessage("To archive", "This will be archived");

    await messageBoard.archiveMessage(0);
    const messages = await messageBoard.getMessages(owner.address);
    expect(messages[0].status).to.equal(1); // ARCHIVED
  });

  it("❌ 존재하지 않는 메시지를 아카이브하려 하면 에러 발생", async function () {
    await expect(
      messageBoard.archiveMessage(5)
    ).to.be.revertedWith("Invalid index");
  });
});
