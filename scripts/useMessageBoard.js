const hre = require("hardhat");

async function main() {
  const address = "0x160333145E1063ea9a66C43e1C840737181C7beC"; 
  const [user] = await hre.ethers.getSigners();
  const MessageBoard = await hre.ethers.getContractAt("MessageBoard", address, user);

  // 1. postMessage (트랜잭션 발생)
  console.log("📝 Posting message...");
  const tx1 = await MessageBoard.postMessage("Hello Title", "This is the body");
  console.log("📨 TX Hash (postMessage):", tx1.hash); // 💡 추가
  await tx1.wait();
  console.log("✅ Message posted!");

  // 2. getMessageCount
  const count = await MessageBoard.getMessageCount(user.address);
  console.log("📊 Total messages:", count.toString());

  // 3. getMessages
  const messages = await MessageBoard.getMessages(user.address);
  console.log("📬 My messages:");
  messages.forEach((msg, index) => {
    console.log(`  [${index}] ${msg.title} - ${msg.body} (Status: ${msg.status}, Time: ${msg.timestamp})`);
  });

  // 4. archiveMessage (index 0 아카이브)
  if (messages.length > 0) {
    console.log("📦 Archiving first message...");
    const tx2 = await MessageBoard.archiveMessage(0);
    console.log("📨 TX Hash (archiveMessage):", tx2.hash); // 💡 추가
    await tx2.wait();
    console.log("✅ First message archived.");
  }

  // 5. 다시 메시지 상태 확인
  const updated = await MessageBoard.getMessages(user.address);
  console.log("🔄 Updated messages:");
  updated.forEach((msg, index) => {
    console.log(`  [${index}] ${msg.title} - ${msg.body} (Status: ${msg.status})`);
  });
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
