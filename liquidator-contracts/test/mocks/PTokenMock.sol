// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IPToken} from "../../src/interfaces/IPToken.sol";
import {IERC20} from "../../src/interfaces/IERC20.sol";
import {ERC20Mock} from "./ERC20Mock.sol";

// Mock PToken for testing
contract PTokenMock is IPToken, ERC20Mock {
    IERC20 public underlying;

    constructor(
        string memory name_,
        string memory symbol_,
        address _underlyingAddress
    ) ERC20Mock(name_, symbol_) {
        underlying = IERC20(_underlyingAddress);
    }

    function allowance(
        address owner,
        address spender
    ) public view override(IERC20, ERC20) returns (uint256) {
        return super.allowance(owner, spender);
    }

    function approve(
        address spender,
        uint256 amount
    ) public override(IERC20, ERC20) returns (bool) {
        return super.approve(spender, amount);
    }

    function totalSupply()
        public
        view
        override(IERC20, ERC20)
        returns (uint256)
    {
        return super.totalSupply();
    }

    function balanceOf(
        address account
    ) public view override(IERC20, ERC20) returns (uint256) {
        return super.balanceOf(account);
    }

    function transfer(
        address to,
        uint256 amount
    ) public override(IERC20, ERC20) returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override(IERC20, ERC20) returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    function decimals() public view virtual override(ERC20) returns (uint8) {
        return super.decimals();
    }

    function liquidateBorrow(
        address borrower,
        uint256 repayAmount,
        IPToken pTokenCollateral
    ) external override {
        // Simulate liquidation by transferring tokens
        // 1. Take repayAmount of underlying from liquidator
        underlying.transferFrom(msg.sender, address(this), repayAmount);

        // 2. Give collateral tokens to liquidator (1.1x the repay amount for testing)
        uint256 seizeAmount = (repayAmount * 110) / 100;
        PTokenMock(address(pTokenCollateral)).mint(msg.sender, seizeAmount);
    }

    function redeem(uint256 amount) external override {
        _burn(msg.sender, amount);
        underlying.transfer(msg.sender, amount);
    }

    function mint(uint256) external pure override {
        revert("Not implemented");
    }

    function borrow(uint256) external pure override {
        revert("Not implemented");
    }

    function repayBorrow(uint256) external pure override {
        revert("Not implemented");
    }

    function seize(address, address, uint256) external pure override {
        revert("Not implemented");
    }
}
