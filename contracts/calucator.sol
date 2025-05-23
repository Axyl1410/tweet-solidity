// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Calucator {
    uint256 result = 0;

    function add(uint256 number) public {
        result += number;
    }

    function sub(uint256 number) public {
        result -= number;
    }

    function mul(uint256 number) public {
        result *= number;
    }

    function div(uint256 number) public {
        //todo fix check for zero
        require(number != 0, "Division by zero is not allowed");
        result /= number;
    }

    function get() public view returns (uint256) {
        return result;
    }
}
