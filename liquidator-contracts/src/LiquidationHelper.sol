// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {IERC20} from "./interfaces/IERC20.sol";
import {IPToken} from "./interfaces/IPToken.sol";

/// @title LiquidationHelper
/// @notice Permissionless helper contract for executing Pike liquidations with swaps
contract LiquidationHelper {
    /// @notice Execute liquidation with swap
    /// @param pool Uniswap V3 pool to swap with
    /// @param debtPToken PToken contract of the debt to be repaid
    /// @param collateralPToken PToken contract where collateral will be seized
    /// @param user Address of the user to liquidate
    /// @param debtAmount Amount of debt to repay
    function liquidate(
        address pool,
        IPToken debtPToken,
        IPToken collateralPToken,
        address user,
        uint256 debtAmount
    ) external {
        // Prepare callback data
        bytes memory data = abi.encode(
            debtPToken,
            collateralPToken,
            user,
            debtAmount,
            msg.sender // Store original caller
        );

        IUniswapV3Pool uniPool = IUniswapV3Pool(pool);

        // Determine swap direction by checking if debt token is token0
        bool zeroForOne = address(debtPToken.underlying()) != uniPool.token0();

        // Execute swap with exact output (negative amount)
        // We want exactly debtAmount of the debt token
        IUniswapV3Pool(pool).swap(
            address(this), // recipient
            zeroForOne,
            -int256(debtAmount), // negative for exact output
            zeroForOne ? MIN_SQRT_RATIO + 1 : MAX_SQRT_RATIO - 1,
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
        // Decode callback data
        (
            IPToken debtPToken,
            IPToken collateralPToken,
            address user,
            uint256 debtAmount,
            address caller
        ) = abi.decode(_data, (IPToken, IPToken, address, uint256, address));

        IERC20 debtToken = IERC20(debtPToken.underlying());
        IERC20 collateralToken = IERC20(collateralPToken.underlying());

        // Get pool reference
        IUniswapV3Pool pool = IUniswapV3Pool(msg.sender);

        // For exact output, the delta we pay will be positive
        address tokenToPayAddress = amount0Delta > 0
            ? pool.token0()
            : pool.token1();
        IERC20 tokenToPay = IERC20(tokenToPayAddress);

        require(
            tokenToPayAddress == address(collateralToken),
            "Invalid token to pay"
        );

        uint256 amountToPay = uint256(
            amount0Delta > 0 ? amount0Delta : amount1Delta
        );

        // Approve debt token spending
        debtToken.approve(address(debtPToken), debtAmount);

        // Execute liquidation
        debtPToken.liquidateBorrow(user, debtAmount, collateralPToken);

        // Verify received collateral amount
        uint256 collateralReceived = collateralPToken.balanceOf(address(this));

        // Convert seized pTokens to underlying
        collateralPToken.redeem(collateralReceived);

        // Pay the swap with collateral token
        collateralToken.transfer(msg.sender, amountToPay);

        // Transfer remaining collateral to caller
        uint256 remainingCollateral = collateralToken.balanceOf(address(this));
        require(
            collateralToken.transfer(caller, remainingCollateral),
            "Collateral transfer failed"
        );
    }

    // Constants for price limits
    uint160 internal constant MIN_SQRT_RATIO = 4295128739;
    uint160 internal constant MAX_SQRT_RATIO =
        1461446703485210103287273052203988822378723970342;
}
