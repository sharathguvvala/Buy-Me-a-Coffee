//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract BuyMeACoffee {
    event NewMessage (
        address indexed sender,
        uint256 timestamp,
        string name,
        string message
    );

    struct Message {
        address sender;
        uint256 timestamp;
        string name;
        string message;
    }

    Message[] messages;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0,'insufficient eth');
        messages.push(Message(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));
        emit NewMessage(msg.sender, block.timestamp, _name, _message);
    }

    function withdawFunds() public {
        require(owner.send(address(this).balance));
    }

    function getMessages() view public returns(Message[] memory) {
        return messages;
    }
}
