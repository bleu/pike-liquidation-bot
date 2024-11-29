// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IERC20.sol";

contract OracleEngineMock {
    mapping(address => uint256) prices;

    /// usd price with 6 decimals
    function setPrice(address asset, uint256 price) external {
        uint8 decimals = IERC20(asset).decimals();
        prices[asset] = price * (10 ** (30 - decimals));
    }

    function getPrice(address asset) external view returns (uint256 price) {
        return prices[address(asset)];
    }
}
