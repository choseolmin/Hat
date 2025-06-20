const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // 1. VariableExample
  const Variable = await ethers.getContractFactory("VariableExample");
  const variable = await Variable.deploy();
  await variable.deployed();
  console.log("VariableExample publicVar:", await variable.publicVar());
  console.log("VariableExample getPrivateVar:", (await variable.getPrivateVar()).toNumber());

  // 2. FunctionExample
  const Func = await ethers.getContractFactory("FunctionExample");
  const func = await Func.deploy();
  await func.deployed();
  await func.increment();
  console.log("FunctionExample count:", (await func.count()).toNumber());
  console.log("FunctionExample getDouble(3):", (await func.getDouble(3)).toNumber());

  // 3. ControlStructureExample
  const Control = await ethers.getContractFactory("ControlStructureExample");
  const control = await Control.deploy();
  await control.deployed();
  console.log("ControlStructureExample sumEven(10):", (await control.sumEven(10)).toNumber());

  // 4. EventExample
  const [signer] = await ethers.getSigners();
  const Event = await ethers.getContractFactory("EventExample");
  const event = await Event.deploy();
  await event.deployed();
  const tx = await event.sayHello();
  const receipt = await tx.wait();
  const greetEvent = receipt.events.find(e => e.event === "Greet");
  if (greetEvent) {
    console.log("EventExample Greet event:", greetEvent.args.from, greetEvent.args.message);
  }

  // 5. ModifierExample
  const [owner, other] = await ethers.getSigners();
  const Modifier = await ethers.getContractFactory("ModifierExample");
  const modifier = await Modifier.connect(owner).deploy();
  await modifier.deployed();
  await modifier.connect(owner).sensitiveAction();
  try {
    await modifier.connect(other).sensitiveAction();
  } catch (e) {
    console.log("ModifierExample onlyOwner revert:", e.message);
  }

  // 6. ErrorHandlingExample
  const ErrorExample = await ethers.getContractFactory("ErrorHandlingExample");
  const err = await ErrorExample.deploy();
  await err.deployed();
  console.log("ErrorHandlingExample divide(10,2):", (await err.divide(10, 2)).toNumber());
  try {
    await err.divide(10, 0);
  } catch (e) {
    console.log("ErrorHandlingExample divide(10,0) revert:", e.message);
  }

  // 7. EtherTransferExample
  const [sender, receiver] = await ethers.getSigners();
  const EtherTransfer = await ethers.getContractFactory("EtherTransferExample");
  const etherContract = await EtherTransfer.connect(sender).deploy(receiver.address);
  await etherContract.deployed();
  await sender.sendTransaction({
    to: etherContract.address,
    value: ethers.utils.parseEther("1.5"),
  });
  const before = await ethers.provider.getBalance(receiver.address);
  await etherContract.sendEther();
  const after = await ethers.provider.getBalance(receiver.address);
  console.log("EtherTransferExample receiver balance diff (should be 1 ETH):", ethers.utils.formatEther(after.sub(before)));
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
}); 