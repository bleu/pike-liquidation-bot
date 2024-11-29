// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IUniswapV3SwapCallback} from "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";
import {TickMath} from "../libraries/TickMath.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {SignedMath} from "@openzeppelin/contracts/utils/math/SignedMath.sol";
import {IERC20} from "../interfaces/IERC20.sol";
import {IOracleEngine} from "../interfaces/IOracleEngine.sol";

contract UniswapV3PoolMockFactory {
    bytes32 public immutable POOL_INIT_CODE_HASH =
        keccak256(type(UniswapV3PoolMock).creationCode);

    function createPool(
        address token0,
        address token1,
        uint24 fee
    ) external returns (address pool) {
        bytes32 salt = keccak256(abi.encode(token0, token1, fee));

        pool = address(new UniswapV3PoolMock{salt: salt}(token0, token1, fee));
    }

    function computeAddress(
        address token0,
        address token1,
        uint24 fee
    ) public view returns (address) {
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

// zeroForOne is true if token0 is the going from user to pool and token 1 is going from pool to user
// if zeroForOne is false, then the opposite
contract UniswapV3PoolMock {
    using Math for uint256;
    using SignedMath for int256;

    address public immutable token0;
    address public immutable token1;
    uint24 public immutable fee;
    address public oracle;

    // Constants for price limit validation

    constructor(address _token0, address _token1, uint24 _fee) {
        token0 = _token0;
        token1 = _token1;
        fee = _fee;
    }

    function setOracle(address _oracle) external {
        oracle = _oracle;
    }

    function swap(
        address recipient,
        bool zeroForOne,
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96,
        bytes calldata data
    ) external returns (int256 amount0, int256 amount1) {
        require(amountSpecified != 0, "AS");

        require(
            sqrtPriceLimitX96 >= TickMath.MIN_SQRT_RATIO &&
                sqrtPriceLimitX96 <= TickMath.MAX_SQRT_RATIO,
            "SPL"
        );

        // Get current prices from oracle (scaled to 1e30)
        uint256 price0 = IOracleEngine(oracle).getPrice(token0);
        uint256 price1 = IOracleEngine(oracle).getPrice(token1);
        require(price0 > 0 && price1 > 0, "IP");

        bool exactInput = amountSpecified > 0;
        uint256 absAmount = amountSpecified.abs();

        // Calculate amounts based on direction
        if (zeroForOne) {
            // Trading token0 for token1
            if (exactInput) {
                uint256 feeAmount = absAmount.mulDiv(fee, 1e6);
                uint256 amountInAfterFee = absAmount - feeAmount;
                uint256 amountOut = amountInAfterFee.mulDiv(price0, price1);

                amount0 = int256(absAmount);
                amount1 = -int256(amountOut);
            } else {
                uint256 amountInBeforeFee = absAmount.mulDiv(price1, price0);
                uint256 feeAmount = amountInBeforeFee.mulDiv(fee, 1e6);
                uint256 amountIn = amountInBeforeFee + feeAmount;

                amount0 = int256(amountIn);
                amount1 = -int256(absAmount);
            }
        } else {
            // Trading token1 for token0
            if (exactInput) {
                uint256 feeAmount = absAmount.mulDiv(fee, 1e6);
                uint256 amountInAfterFee = absAmount - feeAmount;
                uint256 amountOut = amountInAfterFee.mulDiv(price1, price0);

                amount0 = -int256(amountOut);
                amount1 = int256(absAmount);
            } else {
                uint256 amountInBeforeFee = absAmount.mulDiv(price0, price1);
                uint256 feeAmount = amountInBeforeFee.mulDiv(fee, 1e6);
                uint256 amountIn = amountInBeforeFee + feeAmount;

                amount0 = -int256(absAmount);
                amount1 = int256(amountIn);
            }
        }

        uint256 balanceBefore = zeroForOne ? balance0() : balance1();

        if (zeroForOne) {
            if (amount1 < 0)
                IERC20(token1).transfer(recipient, uint256(-amount1));
        } else {
            if (amount0 < 0)
                IERC20(token0).transfer(recipient, uint256(-amount0));
        }

        IUniswapV3SwapCallback(msg.sender).uniswapV3SwapCallback(
            amount0,
            amount1,
            data
        );

        if (zeroForOne) {
            require(balanceBefore + uint256(amount0) <= balance0(), "IIA");
        } else {
            require(balanceBefore + uint256(amount1) <= balance1(), "IIA");
        }
    }

    function balance0() private view returns (uint256) {
        return IERC20(token0).balanceOf(address(this));
    }

    function balance1() private view returns (uint256) {
        return IERC20(token1).balanceOf(address(this));
    }
}
