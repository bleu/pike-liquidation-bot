// GetConstructorArgs.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import {UniswapV3PoolMock} from "../src/mocks/UniswapV3PoolMock.sol";

contract GetConstructorArgs is Script {
    function run() external {
        // Get constructor arguments
        address oracleEngine = 0xC64Aab296472AD1e52eD6e9baea8A504D3000ab1;
        bytes memory encodedArgs = abi.encode(
            oracleEngine,
            type(UniswapV3PoolMock).creationCode
        );

        // Convert to hex string, removing 0x prefix
        string memory hexStr = toHexString(encodedArgs);

        // Write to file
        vm.writeFile("constructor-args.txt", hexStr);
    }

    function toHexString(
        bytes memory data
    ) public pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(2 * data.length);
        for (uint256 i = 0; i < data.length; i++) {
            str[2 * i] = alphabet[uint8(data[i] >> 4)];
            str[2 * i + 1] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }
}
