// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC20} from "./IERC20.sol";

interface IPToken is IERC20 {
    /**
     * @notice Sender supplies assets into the market and receives pTokens in exchange
     * @dev Accrues interest whether or not the operation succeeds, unless reverted
     * @param mintAmount The amount of the underlying asset to supply
     */
    function mint(uint256 mintAmount) external;

    /**
     * @notice Sender redeems pTokens in exchange for the underlying asset
     * @dev Accrues interest whether or not the operation succeeds, unless reverted
     * @param redeemTokens The number of pTokens to redeem into underlying
     */
    function redeem(uint256 redeemTokens) external;

    /**
     * @notice Sender borrows assets from the protocol to their own address
     * @param borrowAmount The amount of the underlying asset to borrow
     */
    function borrow(uint256 borrowAmount) external;

    /**
     * @notice Sender repays their own borrow
     * @param repayAmount The amount to repay, or type(uint256).max for the full outstanding amount
     */
    function repayBorrow(uint256 repayAmount) external;

    /**
     * @notice The sender liquidates the borrowers collateral.
     *  The collateral seized is transferred to the liquidator.
     * @param borrower The borrower of this pToken to be liquidated
     * @param repayAmount The amount of the underlying borrowed asset to repay
     * @param pTokenCollateral The market in which to seize collateral from the borrower
     */
    function liquidateBorrow(
        address borrower,
        uint256 repayAmount,
        IPToken pTokenCollateral
    ) external;

    function seize(
        address liquidator,
        address borrower,
        uint256 seizeTokens
    ) external;

    /**
     * @notice Returns the pToken decimals
     */
    function underlying() external view returns (IERC20);
}
