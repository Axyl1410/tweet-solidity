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

    function reset() public {
        result = 0;
    }

    function get() public view returns (uint256) {
        return result;
    }
}
