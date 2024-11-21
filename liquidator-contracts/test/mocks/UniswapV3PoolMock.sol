// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20Mock} from "./ERC20Mock.sol";

contract UniswapV3PoolMock {
    address public token0;
    address public token1;

    constructor(address _token0, address _token1, uint24 _fee) {
        require(_token0 < _token1, "Wrong token order");
        token0 = _token0;
        token1 = _token1;
    }

    function balance0() public view returns (uint256) {
        return ERC20Mock(token0).balanceOf(address(this));
    }

    function balance1() public view returns (uint256) {
        return ERC20Mock(token1).balanceOf(address(this));
    }

    function swap(
        address recipient,
        bool zeroForOne, // user receives pays token 0 and receives token 1 if true
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96,
        bytes calldata data
    ) external returns (int256 amount0, int256 amount1) {
        // Considers an constant sum pool for simplicity
        bool isSpecifiedAmountPositive = amountSpecified > 0;
        int256 positiveAmount = isSpecifiedAmountPositive
            ? amountSpecified
            : -amountSpecified;
        int256 negativeAmount = isSpecifiedAmountPositive
            ? -amountSpecified
            : amountSpecified;

        (amount0, amount1) = zeroForOne
            ? (positiveAmount, negativeAmount)
            : (negativeAmount, positiveAmount);

        // do the transfers and collect payment
        if (zeroForOne) {
            if (amount1 < 0)
                ERC20Mock(token1).transfer(recipient, uint256(-amount1));

            uint256 balance0Before = balance0();
            IUniswapV3SwapCallback(msg.sender).uniswapV3SwapCallback(
                amount0,
                amount1,
                data
            );
            require(balance0Before + uint256(amount0) <= balance0(), "IIA");
        } else {
            if (amount0 < 0)
                ERC20Mock(token0).transfer(recipient, uint256(-amount0));

            uint256 balance1Before = balance1();
            IUniswapV3SwapCallback(msg.sender).uniswapV3SwapCallback(
                amount0,
                amount1,
                data
            );
            require(balance1Before + uint256(amount1) <= balance1(), "IIA");
        }
    }
}

interface IUniswapV3SwapCallback {
    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external;
}
