// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MessageBoard {
    struct Message {
        string title;
        string body;
        uint256 timestamp;
        Status status;
    }

    enum Status { ACTIVE, ARCHIVED }

    mapping(address => Message[]) private userMessages;

    event MessagePosted(address indexed user, string title, string body);
    event MessageArchived(address indexed user, uint256 index);

    function postMessage(string memory _title, string memory _body) public {
        Message memory newMsg = Message({
            title: _title,
            body: _body,
            timestamp: block.timestamp,
            status: Status.ACTIVE
        });

        userMessages[msg.sender].push(newMsg);
        emit MessagePosted(msg.sender, _title, _body);
    }

    function archiveMessage(uint256 index) public {
        require(index < userMessages[msg.sender].length, "Invalid index");
        userMessages[msg.sender][index].status = Status.ARCHIVED;
        emit MessageArchived(msg.sender, index);
    }

    function getMessages(address _user) public view returns (Message[] memory) {
        return userMessages[_user];
    }

    function getMessageCount(address _user) public view returns (uint256) {
        return userMessages[_user].length;
    }
}
