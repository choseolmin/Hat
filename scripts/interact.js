const hre = require("hardhat");

async function main() {
  const address = "0x160333145E1063ea9a66C43e1C840737181C7beC"; 
  const MessageBoard = await hre.ethers.getContractAt("MessageBoard", address);

  // postMessage 함수 호출 (트랜잭션)
  const tx = await MessageBoard.postMessage("테스트 제목", "테스트 내용");
  await tx.wait();
  console.log("메시지 저장 완료!");

  // getMessages 함수 호출 (조회)
  const signer = await hre.ethers.provider.getSigner();
  const myAddress = await signer.getAddress();
  const messages = await MessageBoard.getMessages(myAddress);
  console.log("내 메시지 목록:", messages);
}

main().catch(console.error); 