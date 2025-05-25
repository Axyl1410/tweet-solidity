// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Hello {
    string greeting = "Hello, World!";

    function getGreeting() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
