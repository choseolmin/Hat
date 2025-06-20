// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 1. 변수 선언 및 가시성
contract VariableExample {
    string public publicVar = unicode"공개 변수";
    uint private privateVar = 100;

    function getPrivateVar() public view returns (uint) {
        return privateVar;
    }
}

// 2. 함수 (Functions)
contract FunctionExample {
    uint public count = 0;

    function increment() public {
        count += 1;
    }

    function getDouble(uint x) public pure returns (uint) {
        return x * 2;
    }
}

// 3. 조건문 및 반복문 (Control Structures)
contract ControlStructureExample {
    function sumEven(uint max) public pure returns (uint) {
        uint sum = 0;
        for (uint i = 0; i <= max; i++) {
            if (i % 2 == 0) {
                sum += i;
            }
        }
        return sum;
    }
}

// 4. 이벤트 (Events)
contract EventExample {
    event Greet(address indexed from, string message);

    function sayHello() public {
        emit Greet(msg.sender, unicode"안녕하세요!");
    }
}

// 5. 접근 제어자 (Modifiers)
contract ModifierExample {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, unicode"오직 소유자만 호출 가능");
        _;
    }

    function sensitiveAction() public onlyOwner {
        // 민감한 작업 수행
    }
}

// 6. 에러 처리 (Error Handling)
contract ErrorHandlingExample {
    function divide(uint a, uint b) public pure returns (uint) {
        require(b != 0, unicode"0으로 나눌 수 없습니다.");
        return a / b;
    }
}

// 7. 이더 송금 (Ether Transfer)
contract EtherTransferExample {
    address payable public recipient;

    constructor(address _recipient) {
        recipient = payable(_recipient);
    }

    receive() external payable {}

    function sendEther() public {
        require(address(this).balance >= 1 ether, unicode"잔액 부족");
        recipient.transfer(1 ether);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
