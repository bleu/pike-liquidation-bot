// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20Mock} from "./ERC20Mock.sol";
import {IUniswapV3SwapCallback} from "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";

contract UniswapV3PoolMockFactory {
    bytes32 public immutable POOL_INIT_CODE_HASH =
        keccak256(type(UniswapV3PoolMock).creationCode);

    function createPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external returns (address pool) {
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0));

        bytes32 salt = keccak256(abi.encode(token0, token1, fee));

        pool = address(new UniswapV3PoolMock{salt: salt}(token0, token1, fee));
    }

    function computeAddress(
        address tokenA,
        address tokenB,
        uint24 fee
    ) public view returns (address) {
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);

        bytes32 salt = keccak256(abi.encode(token0, token1, fee));
        bytes32 initCodeHash = keccak256(
            abi.encodePacked(
                type(UniswapV3PoolMock).creationCode,
                abi.encode(token0, token1, fee)
            )
        );
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(
                                hex"ff",
                                address(this),
                                salt,
                                initCodeHash
                            )
                        )
                    )
                )
            );
    }
}

contract UniswapV3PoolMock {
    address public token0;
    address public token1;
    uint24 public fee;

    uint160 public constant FIXED_PRICE_96 = 79228162514264337593543950336;
    uint160 public constant MIN_SQRT_RATIO = 4295128739;
    uint160 public constant MAX_SQRT_RATIO =
        1461446703485210103287273052203988822378723970342;

    constructor(address _token0, address _token1, uint24 _fee) {
        require(_token0 < _token1, "Wrong token order");
        token0 = _token0;
        token1 = _token1;
        fee = _fee;
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
        if (zeroForOne) {
            require(sqrtPriceLimitX96 < FIXED_PRICE_96, "SPL");
            require(sqrtPriceLimitX96 > MIN_SQRT_RATIO, "SPL");
        } else {
            require(sqrtPriceLimitX96 > FIXED_PRICE_96, "SPL");
            require(sqrtPriceLimitX96 < MAX_SQRT_RATIO, "SPL");
        }

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
