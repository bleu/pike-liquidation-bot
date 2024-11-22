// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import {LiquidationHelper} from "../src/LiquidationHelper.sol";
import {ERC20Mock} from "./mocks/ERC20Mock.sol";
import {PTokenMock} from "./mocks/PTokenMock.sol";
import {UniswapV3PoolMock, UniswapV3PoolMockFactory} from "./mocks/UniswapV3PoolMock.sol";

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

    // Price constants
    uint160 constant MIN_SQRT_RATIO = 4295128739;
    uint160 constant MAX_SQRT_RATIO =
        1461446703485210103287273052203988822378723970342;

    address token0;
    address token1;

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
        (token0, token1) = address(debtToken) < address(collateralToken)
            ? (address(debtToken), address(collateralToken))
            : (address(collateralToken), address(debtToken));

        UniswapV3PoolMockFactory factory = new UniswapV3PoolMockFactory();

        pool = UniswapV3PoolMock(factory.createPool(token0, token1, 3000));

        liquidationHelper = new LiquidationHelper(
            address(factory),
            type(UniswapV3PoolMock).creationCode
        );

        debtToken.mint(address(pool), 10000e18);
        collateralToken.mint(address(pool), 10000e18);

        collateralToken.mint(address(collateralPToken), 10000e18);

        vm.startPrank(address(collateralPToken));
        collateralToken.approve(address(collateralPToken), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(address(liquidationHelper));
        debtToken.approve(address(debtPToken), type(uint256).max);
        collateralToken.approve(address(pool), type(uint256).max);
        vm.stopPrank();
    }

    function test_liquidation_success() public {
        uint256 debtAmount = 1000e18;

        vm.startPrank(liquidator);

        liquidationHelper.liquidate(
            address(pool),
            debtPToken,
            collateralPToken,
            borrower,
            debtAmount,
            MIN_SQRT_RATIO + 1,
            0
        );

        assertGt(
            collateralToken.balanceOf(liquidator),
            0,
            "Liquidator should receive correct collateral amount"
        );

        vm.stopPrank();
    }

    function test_liquidation_outside_price_boundaries() public {
        uint256 debtAmount = 1000e18;

        vm.startPrank(liquidator);

        vm.expectRevert(bytes("SPL"));

        // Test at minimum valid price
        liquidationHelper.liquidate(
            address(pool),
            debtPToken,
            collateralPToken,
            borrower,
            debtAmount,
            MIN_SQRT_RATIO,
            0
        );

        vm.expectRevert(bytes("SPL"));

        liquidationHelper.liquidate(
            address(pool),
            debtPToken,
            collateralPToken,
            borrower,
            debtAmount,
            MAX_SQRT_RATIO,
            0
        );
        // Test at maximum valid price

        vm.stopPrank();
    }

    function test_liquidation_bellow_min_amount_out() public {
        uint256 debtAmount = 1000e18;

        vm.startPrank(liquidator);

        vm.expectRevert(bytes("Insufficient output amount"));

        // Test at minimum valid price
        liquidationHelper.liquidate(
            address(pool),
            debtPToken,
            collateralPToken,
            borrower,
            debtAmount,
            MIN_SQRT_RATIO + 1,
            1000000e18
        );

        vm.stopPrank();
    }

    function test_liquidation_from_another_factory() public {
        uint256 debtAmount = 1000e18;

        UniswapV3PoolMockFactory newFactory = new UniswapV3PoolMockFactory();

        UniswapV3PoolMock differentFactoryPool = UniswapV3PoolMock(
            newFactory.createPool(token0, token1, 3000)
        );

        debtToken.mint(address(differentFactoryPool), 10000e18);
        collateralToken.mint(address(differentFactoryPool), 10000e18);

        vm.startPrank(liquidator);

        vm.expectRevert(bytes("Invalid callback sender"));

        liquidationHelper.liquidate(
            address(differentFactoryPool),
            debtPToken,
            collateralPToken,
            borrower,
            debtAmount,
            MIN_SQRT_RATIO + 1,
            0
        );

        vm.stopPrank();
    }
}
