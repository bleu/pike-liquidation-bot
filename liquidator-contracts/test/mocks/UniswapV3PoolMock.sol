// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20Mock} from "./ERC20Mock.sol";

contract UniswapV3PoolMock {
    address public token0;
    address public token1;

    // Q64.96 price for 1:1
    // How to calculate:
    // - For a 1:1 price, we need price = 1
    // - In Q64.96 format: price = sqrt(1) * 2^96
    // - sqrt(1) = 1
    // - So, 1 * 2^96 = 79228162514264337593543950336
    uint160 public constant FIXED_PRICE_96 = 79228162514264337593543950336;

    // Minimum allowed sqrt price in Uniswap v3
    // Equivalent to a price of 2^-276 ≈ 1e-83
    uint160 public constant MIN_SQRT_RATIO = 4295128739;

    // Maximum allowed sqrt price in Uniswap v3
    // Equivalent to a price of 2^276 ≈ 1e83
    uint160 public constant MAX_SQRT_RATIO =
        1461446703485210103287273052203988822378723970342;

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
        bool zeroForOne,
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96,
        bytes calldata data
    ) external returns (int256 amount0, int256 amount1) {
        // Check price limits against our fixed 1:1 price
        if (zeroForOne) {
            // When trading token0 for token1, price can't go below limit
            require(sqrtPriceLimitX96 < FIXED_PRICE_96, "SPL");
            require(sqrtPriceLimitX96 > MIN_SQRT_RATIO, "SPL");
        } else {
            // When trading token1 for token0, price can't go above limit
            require(sqrtPriceLimitX96 > FIXED_PRICE_96, "SPL");
            require(sqrtPriceLimitX96 < MAX_SQRT_RATIO, "SPL");
        }

        // Calculate swap amounts (1:1 rate)
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

        // Execute transfers
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
