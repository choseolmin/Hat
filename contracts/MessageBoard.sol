// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MessageBoard {
    mapping(address => string) private messages;

    event MessageUpdated(address indexed user, string newMessage);

    function setMessage(string memory _message) public {
        messages[msg.sender] = _message;
        emit MessageUpdated(msg.sender, _message);
    }

    function getMessage(address _user) public view returns (string memory) {
        return messages[_user];
    }
}
