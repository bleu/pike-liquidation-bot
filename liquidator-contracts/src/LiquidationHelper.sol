// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {TickMath} from "./libraries/TickMath.sol";
import {IERC20} from "./interfaces/IERC20.sol";
import {IPToken} from "./interfaces/IPToken.sol";
import {CallbackValidation} from "./CallbackValidation.sol";

/// @title LiquidationHelper
/// @notice Permissionless helper contract for executing Pike liquidations with swaps
contract LiquidationHelper is CallbackValidation {
    address public uni_v3_factory;

    constructor(
        address _uni_v3_factory,
        bytes memory _pool_init_code_hash
    ) CallbackValidation(_pool_init_code_hash) {
        uni_v3_factory = _uni_v3_factory;
    }
    /// @notice Execute liquidation with swap
    /// @param pool Uniswap V3 pool to swap with
    /// @param debtPToken PToken contract of the debt to be repaid
    /// @param collateralPToken PToken contract where collateral will be seized
    /// @param user Address of the user to liquidate
    /// @param debtAmount Amount of debt to repay
    /// @param minOutputAmount Minimum amount of collateral to receive after liquidation to protect against price manipulation
    function liquidate(
        address pool,
        IPToken debtPToken,
        IPToken collateralPToken,
        address user,
        uint256 debtAmount,
        uint256 minOutputAmount
    ) external {
        // Prepare callback data
        bytes memory data = abi.encode(
            debtPToken,
            collateralPToken,
            user,
            debtAmount,
            msg.sender, // Store original caller
            minOutputAmount,
            pool
        );

        IUniswapV3Pool uniPool = IUniswapV3Pool(pool);

        // zeroForOne is true if you want to sell token0 and buy token 1 is going from pool to user, if zeroForOne is false, then the opposite
        // Determine swap direction by checking if debt token is token0
        // We want to buy the debtToken and sell the collateral
        bool zeroForOne = address(debtPToken.underlying()) != uniPool.token0();

        // Execute swap with exact output (negative amount)
        // We want exactly debtAmount of the debt token
        IUniswapV3Pool(pool).swap(
            address(this), // recipient
            zeroForOne,
            -int256(debtAmount), // negative for exact output
            zeroForOne
                ? TickMath.MIN_SQRT_RATIO + 1
                : TickMath.MAX_SQRT_RATIO - 1,
            data
        );
    }

    /// @notice Callback for Uniswap V3 swap
    /// @param amount0Delta amount of token0 received (negative) or paid (positive)
    /// @param amount1Delta amount of token1 received (negative) or paid (positive)
    /// @param _data Callback data
    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata _data
    ) external {
        (
            IPToken debtPToken,
            IPToken collateralPToken,
            address user,
            uint256 debtAmount,
            address caller,
            uint256 minOutputAmount,
            address poolAddress
        ) = abi.decode(
                _data,
                (IPToken, IPToken, address, uint256, address, uint256, address)
            );

        IERC20 collateralToken = IERC20(collateralPToken.underlying());
        IERC20 debtToken = IERC20(debtPToken.underlying());

        uint256 totalCollateralBefore = collateralToken.balanceOf(
            address(this)
        );

        require(msg.sender == poolAddress, "Invalid pool");

        IUniswapV3Pool uniPool = IUniswapV3Pool(poolAddress);

        address token0 = uniPool.token0();
        address token1 = uniPool.token1();
        uint24 fee = uniPool.fee();

        verifyCallback(uni_v3_factory, token0, token1, fee);

        address tokenToPayAddress = amount0Delta > 0 ? token0 : token1;

        require(
            tokenToPayAddress == address(collateralToken),
            "Invalid token to pay"
        );

        uint256 amountToPay = uint256(
            amount0Delta > 0 ? amount0Delta : amount1Delta
        );

        debtToken.approve(address(debtPToken), debtAmount);

        debtPToken.liquidateBorrow(user, debtAmount, collateralPToken);

        uint256 collateralReceived = collateralPToken.balanceOf(address(this));

        collateralPToken.redeem(collateralReceived);

        collateralToken.transfer(msg.sender, amountToPay);
        uint256 totalCollateralAfter = collateralToken.balanceOf(address(this));
        require(
            totalCollateralAfter - totalCollateralBefore >= minOutputAmount,
            "Insufficient output amount"
        );

        uint256 remainingCollateral = collateralToken.balanceOf(address(this));
        require(
            collateralToken.transfer(caller, remainingCollateral),
            "Collateral transfer failed"
        );
    }
}
