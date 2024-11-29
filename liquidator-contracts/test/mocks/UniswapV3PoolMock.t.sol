// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

import "../../src/libraries/TickMath.sol";
import "../../src/mocks/UniswapV3PoolMock.sol";
import "../../src/mocks/ERC20Mock.sol";
import "../../src/mocks/OracleEngineMock.sol";

contract UniswapV3PoolMockTest is Test {
    UniswapV3PoolMock public pool;
    ERC20Mock public weth;
    ERC20Mock public usdc;
    OracleEngineMock public oracleEngine;
    TestSwapRouter public swapRouter;

    address public user = address(this);
    uint24 constant FEE = 3000; // 0.3%
    uint256 constant WETH_PRICE = 2000e6;
    uint256 constant USDC_PRICE = 1e6;

    function setUp() public {
        // Deploy tokens
        weth = new ERC20Mock("WETH", "WETH", 18);
        usdc = new ERC20Mock("USDC", "USDC", 6);

        // Deploy oracle engine
        oracleEngine = new OracleEngineMock();

        // Set initial prices
        oracleEngine.setPrice(address(weth), WETH_PRICE);
        oracleEngine.setPrice(address(usdc), USDC_PRICE);

        // Deploy pool
        pool = new UniswapV3PoolMock(address(weth), address(usdc), FEE);

        pool.setOracle(address(oracleEngine));

        // Deploy swap router
        swapRouter = new TestSwapRouter(address(pool));

        // Setup initial token balances
        weth.mint(user, 2e18);
        usdc.mint(user, 4000e6);
        weth.mint(address(pool), 1e28);
        usdc.mint(address(pool), 1e28);

        // Approve tokens
        weth.approve(address(swapRouter), type(uint256).max);
        usdc.approve(address(swapRouter), type(uint256).max);
    }

    function test_OraclePrices() public {
        // swap 1 WETH for around 2000 USDC
        uint256 amount = 1e18;

        uint256 balanceOutBefore = usdc.balanceOf(user);

        swapRouter.swap(true, int256(amount), TickMath.MIN_SQRT_RATIO + 1);

        uint256 balanceOutAfter = usdc.balanceOf(user);
        uint256 amountOut = balanceOutAfter - balanceOutBefore;
        assertApproxEqRel(amountOut, 2000e6, 3e15);
    }

    function test_SwapExactInput() public {
        // Swap 1 WETH for USDC
        // WETH is the token 0
        uint256 amount = 1e18;
        uint256 usdcBefore = usdc.balanceOf(user);
        uint256 wethBefore = weth.balanceOf(user);

        swapRouter.swap(true, int256(amount), TickMath.MIN_SQRT_RATIO + 1);

        uint256 usdcAfter = usdc.balanceOf(user);
        uint256 wethAfter = weth.balanceOf(user);
        assertGt(usdcAfter, usdcBefore);
        assertEq(wethBefore - wethAfter, amount);
    }

    function test_SwapExactOutput() public {
        // Swap 2000 UDSC for WETH
        uint256 amount = 2000e6;
        uint256 wethBefore = weth.balanceOf(user);
        uint256 usdcBefore = usdc.balanceOf(user);

        swapRouter.swap(false, -int256(amount), TickMath.MAX_SQRT_RATIO - 1);

        uint256 wethAfter = weth.balanceOf(user);
        uint256 usdcAfter = usdc.balanceOf(user);

        assertGt(usdcBefore, usdcAfter);
        assertEq(wethAfter - wethBefore, amount);
    }
}

// Test swap router contract
contract TestSwapRouter {
    address public immutable pool;

    constructor(address _pool) {
        pool = _pool;
    }

    function swap(
        bool zeroForOne,
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96
    ) external returns (int256 amount0, int256 amount1) {
        bytes memory data = abi.encode(msg.sender);

        return
            UniswapV3PoolMock(pool).swap(
                msg.sender,
                zeroForOne,
                amountSpecified,
                sqrtPriceLimitX96,
                data
            );
    }

    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external {
        IUniswapV3Pool uniPool = IUniswapV3Pool(msg.sender);
        address payer = abi.decode(data, (address));
        address token0 = uniPool.token0();
        address token1 = uniPool.token1();

        IERC20 tokenToPay = amount0Delta > 0 ? IERC20(token0) : IERC20(token1);

        uint256 amountToPay = uint256(
            amount0Delta > 0 ? amount0Delta : amount1Delta
        );

        tokenToPay.transferFrom(payer, msg.sender, amountToPay);
    }
}
