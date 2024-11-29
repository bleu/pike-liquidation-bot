// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/console.sol";
import {Script} from "forge-std/Script.sol";
import {UniswapV3PoolMockFactory, UniswapV3PoolMock} from "../src/mocks/UniswapV3PoolMock.sol";
import {ERC20Mock} from "../src/mocks/ERC20Mock.sol";
import {LiquidationHelper} from "../src/LiquidationHelper.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        ERC20Mock WETH = ERC20Mock(0x0A22133fd28dAf81909F38F177293c9D24a0bF6c);
        ERC20Mock USDC = ERC20Mock(0x758961122308004c05113DF6e8FCB8FED571B30A);
        ERC20Mock stETH = ERC20Mock(0x8E3ff0d169062d266845aCD5FA509D68CAC348b3);
        address oracleEngine = address(
            0xC64Aab296472AD1e52eD6e9baea8A504D3000ab1
        );

        UniswapV3PoolMockFactory factory = new UniswapV3PoolMockFactory();
        UniswapV3PoolMock poolWethUsdc = UniswapV3PoolMock(
            factory.createPool(address(WETH), address(USDC), 100)
        );
        UniswapV3PoolMock poolWethStETH = UniswapV3PoolMock(
            factory.createPool(address(WETH), address(stETH), 10000)
        );
        UniswapV3PoolMock poolUsdcStEth = UniswapV3PoolMock(
            factory.createPool(address(USDC), address(stETH), 3000)
        );

        poolWethUsdc.setOracle(address(oracleEngine));
        poolWethStETH.setOracle(address(oracleEngine));
        poolUsdcStEth.setOracle(address(oracleEngine));

        WETH.mint(address(poolWethUsdc), 1e25);
        USDC.mint(address(poolWethUsdc), 1e25);
        WETH.mint(address(poolWethStETH), 1e25);
        stETH.mint(address(poolWethStETH), 1e25);
        USDC.mint(address(poolUsdcStEth), 1e25);
        stETH.mint(address(poolUsdcStEth), 1e25);

        new LiquidationHelper(
            address(oracleEngine),
            type(UniswapV3PoolMock).creationCode
        );
        vm.stopBroadcast();
    }
}
