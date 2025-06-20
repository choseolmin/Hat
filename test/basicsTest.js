const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity 기본 예제 테스트", function () {

  it("1. VariableExample: public/private 변수 확인", async () => {
    const Variable = await ethers.getContractFactory("VariableExample");
    const variable = await Variable.deploy();

    expect(await variable.publicVar()).to.equal("공개 변수");
    expect((await variable.getPrivateVar()).toNumber()).to.equal(100);
  });

  it("2. FunctionExample: increment와 getDouble", async () => {
    const Func = await ethers.getContractFactory("FunctionExample");
    const func = await Func.deploy();

    await func.increment();
    expect((await func.count()).toNumber()).to.equal(1);
    expect((await func.getDouble(3)).toNumber()).to.equal(6);
  });

  it("3. ControlStructureExample: 짝수 합 구하기", async () => {
    const Control = await ethers.getContractFactory("ControlStructureExample");
    const control = await Control.deploy();

    expect((await control.sumEven(10)).toNumber()).to.equal(30); // 0+2+4+6+8+10
  });

  it("4. EventExample: sayHello 이벤트 emit", async () => {
    const [signer] = await ethers.getSigners();
    const Event = await ethers.getContractFactory("EventExample");
    const event = await Event.deploy();

    // 이벤트 로그 직접 확인
    const tx = await event.sayHello();
    const receipt = await tx.wait();
    const eventLog = receipt.events.find(e => e.event === "Greet");
    expect(eventLog.args.from).to.equal(signer.address);
    expect(eventLog.args.message).to.equal("안녕하세요!");
  });

  it("5. ModifierExample: onlyOwner 테스트", async () => {
    const [owner, other] = await ethers.getSigners();
    const Modifier = await ethers.getContractFactory("ModifierExample");
    const modifier = await Modifier.connect(owner).deploy();

    await modifier.connect(owner).sensitiveAction();
    // revert 검증: try-catch로 대체
    let reverted = false;
    try {
      await modifier.connect(other).sensitiveAction();
    } catch (e) {
      reverted = true;
      expect(e.message).to.include("오직 소유자만 호출 가능");
    }
    expect(reverted).to.be.true;
  });

  it("6. ErrorHandlingExample: divide 테스트", async () => {
    const ErrorExample = await ethers.getContractFactory("ErrorHandlingExample");
    const err = await ErrorExample.deploy();

    expect((await err.divide(10, 2)).toNumber()).to.equal(5);
    let reverted = false;
    try {
      await err.divide(10, 0);
    } catch (e) {
      reverted = true;
      expect(e.message).to.include("0으로 나눌 수 없습니다.");
    }
    expect(reverted).to.be.true;
  });

  it("7. EtherTransferExample: 이더 송금", async () => {
    const [sender, receiver] = await ethers.getSigners();
    console.log("receiver.address:", receiver.address);
    const EtherTransfer = await ethers.getContractFactory("EtherTransferExample");
    const etherContract = await EtherTransfer.connect(sender).deploy(receiver.address);

    // 컨트랙트에 1.5 ETH 송금
    await sender.sendTransaction({
      to: etherContract.address,
      value: ethers.utils.parseEther("1.5"),
    });

    // 이더 전송 전후 수신자 잔액 비교
    const before = await ethers.provider.getBalance(receiver.address);
    await etherContract.sendEther();
    const after = await ethers.provider.getBalance(receiver.address);

    expect(after.sub(before).eq(ethers.utils.parseEther("1.0"))).to.be.true;
  });

});
