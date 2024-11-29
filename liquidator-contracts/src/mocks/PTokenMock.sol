// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

import {IPToken} from "../../src/interfaces/IPToken.sol";
import {IERC20} from "../../src/interfaces/IERC20.sol";
import {ERC20Mock} from "./ERC20Mock.sol";
import {OracleEngineMock} from "./OracleEngineMock.sol";

// Mock PToken for testing
contract PTokenMock is IPToken, ERC20Mock {
    IERC20 public underlying;
    OracleEngineMock public oracle;
    using Math for uint256;

    constructor(
        string memory name_,
        string memory symbol_,
        address _underlyingAddress,
        address _oracle
    ) ERC20Mock(name_, symbol_, 18) {
        oracle = OracleEngineMock(_oracle);
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

    function decimals()
        public
        view
        virtual
        override(IERC20, ERC20Mock)
        returns (uint8)
    {
        return super.decimals();
    }

    function liquidateBorrow(
        address borrower, // keep this for compatibility with the interface
        uint256 repayAmount,
        IPToken pTokenCollateral
    ) external override {
        // Simulate liquidation by transferring tokens
        // 1. Take repayAmount of underlying from liquidator
        underlying.transferFrom(msg.sender, address(this), repayAmount);

        uint256 collateralPrice = oracle.getPrice(
            address(pTokenCollateral.underlying())
        );

        uint256 repayPrice = oracle.getPrice(address(underlying));

        // multiply by 2 to simulate 50% liquidation discount
        uint256 seizeAmount = repayAmount.mulDiv(
            repayPrice * 2,
            collateralPrice
        );

        uint256 seizePTokenAmount = seizeAmount.mulDiv(
            10 ** pTokenCollateral.decimals(),
            10 ** pTokenCollateral.underlying().decimals()
        );

        ERC20Mock(address(pTokenCollateral)).mint(
            msg.sender,
            seizePTokenAmount
        );
    }

    function redeem(uint256 amount) external override {
        _burn(msg.sender, amount);
        uint8 tokenDecimals = underlying.decimals();
        uint256 redeemAmount = amount.mulDiv(
            10 ** tokenDecimals,
            10 ** decimals()
        );
        ERC20Mock(address(underlying)).mint(msg.sender, redeemAmount);
    }

    function mint(uint256) external pure override {}

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
