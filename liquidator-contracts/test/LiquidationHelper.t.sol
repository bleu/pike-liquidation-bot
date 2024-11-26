// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import {TickMath} from "../src/libraries/TickMath.sol";
import {LiquidationHelper} from "../src/LiquidationHelper.sol";
import {ERC20Mock} from "../src/mocks/ERC20Mock.sol";
import {PTokenMock} from "../src/mocks/PTokenMock.sol";
import {UniswapV3PoolMock, UniswapV3PoolMockFactory} from "../src/mocks/UniswapV3PoolMock.sol";
import {OracleEngineMock} from "../src/mocks/OracleEngineMock.sol";

contract LiquidationHelperTest is Test {
    LiquidationHelper public liquidationHelper;

    ERC20Mock public usdcDebtToken;
    ERC20Mock public wethCollateralToken;

    PTokenMock public usdcDebtPToken;
    PTokenMock public wethCollateralPToken;

    OracleEngineMock public oracleEngine;

    UniswapV3PoolMock public pool;

    address public liquidator = address(1);
    address public borrower = address(2);

    function setUp() public {
        usdcDebtToken = new ERC20Mock("USDC", "USDC", 6);
        wethCollateralToken = new ERC20Mock("WETH", "WETH", 18);

        oracleEngine = new OracleEngineMock();
        // Deploy mock PTokens
        usdcDebtPToken = new PTokenMock(
            "Debt USDC PToken",
            "pUSDC",
            address(usdcDebtToken),
            address(oracleEngine)
        );
        wethCollateralPToken = new PTokenMock(
            "Collateral PToken",
            "pCOLL",
            address(wethCollateralToken),
            address(oracleEngine)
        );

        UniswapV3PoolMockFactory factory = new UniswapV3PoolMockFactory();

        pool = UniswapV3PoolMock(
            factory.createPool(
                address(usdcDebtToken),
                address(wethCollateralToken),
                3000
            )
        );

        pool.setOracle(address(oracleEngine));

        oracleEngine.setPrice(address(usdcDebtToken), 1e6);
        oracleEngine.setPrice(address(wethCollateralToken), 2000e6);

        liquidationHelper = new LiquidationHelper(
            address(factory),
            type(UniswapV3PoolMock).creationCode
        );

        usdcDebtToken.mint(address(liquidator), 1e25);
        usdcDebtToken.mint(address(pool), 1e25);
        wethCollateralToken.mint(address(pool), 1e25);

        vm.prank(address(liquidationHelper));
        usdcDebtToken.approve(address(usdcDebtPToken), type(uint256).max);
    }

    function test_liquidation_success() public {
        uint256 debtAmount = 2000e6;

        vm.startPrank(liquidator);

        liquidationHelper.liquidate(
            address(pool),
            usdcDebtPToken,
            wethCollateralPToken,
            borrower,
            debtAmount,
            0
        );

        assertGt(
            wethCollateralToken.balanceOf(liquidator),
            0,
            "Liquidator should receive correct collateral amount"
        );

        vm.stopPrank();
    }

    function test_liquidation_bellow_min_amount_out() public {
        uint256 debtAmount = 2000e6;

        vm.startPrank(liquidator);

        vm.expectRevert(bytes("Insufficient output amount"));

        // Test at minimum valid price
        liquidationHelper.liquidate(
            address(pool),
            usdcDebtPToken,
            wethCollateralPToken,
            borrower,
            debtAmount,
            1000000e18
        );

        vm.stopPrank();
    }

    function test_liquidation_from_another_factory() public {
        uint256 debtAmount = 2000e6;

        UniswapV3PoolMockFactory newFactory = new UniswapV3PoolMockFactory();

        UniswapV3PoolMock differentFactoryPool = UniswapV3PoolMock(
            newFactory.createPool(
                address(usdcDebtToken),
                address(wethCollateralToken),
                3000
            )
        );

        differentFactoryPool.setOracle(address(oracleEngine));

        usdcDebtToken.mint(address(differentFactoryPool), 10000e18);
        wethCollateralToken.mint(address(differentFactoryPool), 10000e18);

        vm.startPrank(liquidator);

        vm.expectRevert(bytes("Invalid callback sender"));

        liquidationHelper.liquidate(
            address(differentFactoryPool),
            usdcDebtPToken,
            wethCollateralPToken,
            borrower,
            debtAmount,
            0
        );

        vm.stopPrank();
    }
}
