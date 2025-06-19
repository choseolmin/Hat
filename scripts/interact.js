const hre = require("hardhat");

async function main() {
  const address = "0x01488C3403992Bb9E99D0ffba2FE10FF6f678071"; // 배포된 컨트랙트 주소
  const MessageBoard = await hre.ethers.getContractAt("MessageBoard", address);

  // setMessage 함수 호출 (트랜잭션)
  const tx = await MessageBoard.setMessage("Hello, blockchain!");
  await tx.wait();
  console.log("메시지 저장 완료!");

  // getMessage 함수 호출 (조회)
  const signer = await hre.ethers.provider.getSigner();
  const myAddress = await signer.getAddress();
  const message = await MessageBoard.getMessage(myAddress);
  console.log(`내 메시지: ${message}`);
}

main().catch(console.error); 