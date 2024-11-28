// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/console.sol";
import {Script} from "forge-std/Script.sol";
import {UniswapV3PoolMock} from "../src/mocks/UniswapV3PoolMock.sol";
import {LiquidationHelper} from "../src/LiquidationHelper.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        new LiquidationHelper(
            address(0x1e198E37b2d997403421C88DB65cC0F9E638B00E), // Uni Pool factory
            type(UniswapV3PoolMock).creationCode
        );
        vm.stopBroadcast();
    }
}
