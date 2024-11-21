// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import {LiquidationHelper} from "../src/LiquidationHelper.sol";
import {ERC20Mock} from "./mocks/ERC20Mock.sol";
import {PTokenMock} from "./mocks/PTokenMock.sol";
import {UniswapV3PoolMock} from "./mocks/UniswapV3PoolMock.sol";

contract LiquidationHelperTest is Test {
    LiquidationHelper public liquidationHelper;

    // Mock tokens
    ERC20Mock public debtToken;
    ERC20Mock public collateralToken;

    // Mock PTokens
    PTokenMock public debtPToken;
    PTokenMock public collateralPToken;

    // Mock Uniswap V3 Pool
    UniswapV3PoolMock public pool;

    // Test addresses
    address public liquidator = address(1);
    address public borrower = address(2);

    function setUp() public {
        // Deploy mock tokens ensuring token0 < token1
        debtToken = new ERC20Mock("Debt Token", "DEBT");
        collateralToken = new ERC20Mock("Collateral Token", "COLL");

        // Deploy mock PTokens
        debtPToken = new PTokenMock("Debt PToken", "pDEBT", address(debtToken));
        collateralPToken = new PTokenMock(
            "Collateral PToken",
            "pCOLL",
            address(collateralToken)
        );

        // Sort tokens for pool creation
        (address token0, address token1) = address(debtToken) <
            address(collateralToken)
            ? (address(debtToken), address(collateralToken))
            : (address(collateralToken), address(debtToken));

        // Deploy mock Uniswap V3 Pool with sorted tokens
        pool = new UniswapV3PoolMock(token0, token1, 3000);

        // Deploy liquidation helper
        liquidationHelper = new LiquidationHelper();

        // Setup initial token balances
        debtToken.mint(address(pool), 10000e18);
        collateralToken.mint(address(pool), 10000e18);

        // Setup PToken collateral
        collateralToken.mint(address(collateralPToken), 10000e18);

        // Approve tokens
        vm.startPrank(address(collateralPToken));
        collateralToken.approve(address(collateralPToken), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(address(liquidationHelper));
        debtToken.approve(address(debtPToken), type(uint256).max);
        collateralToken.approve(address(pool), type(uint256).max);
        vm.stopPrank();
    }

    function test_liquidation_success() public {
        // Setup
        uint256 debtAmount = 1000e18;

        vm.startPrank(liquidator);

        // Execute liquidation
        liquidationHelper.liquidate(
            address(pool),
            debtPToken,
            collateralPToken,
            borrower,
            debtAmount
        );

        // Assert the liquidator received the expected collateral
        assertGt(
            collateralToken.balanceOf(liquidator),
            0,
            "Liquidator should receive correct collateral amount"
        );

        vm.stopPrank();
    }
}
