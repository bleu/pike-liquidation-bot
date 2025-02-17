# Pike Liquidation Bot

## Test Scenario

To perform the tests a mock of all the contracts were deployed, this bot will be created on top of them. To test the bot behavior, 5 positions were created. All the positions and test setup was made using the script `src/scripts/createTestPositions.ts`. The users are:

1. User A(0x62dd5BF48A9DC65113DF25B3C68d01A7c161BB63): Deposited WETH and borrowed stETH
2. User B(0x87A02bD69cFa511FaccC97CD339e16243daF4a5E): Deposited USDC and borrowed WETH and stETH
3. User C(0x96520Fb8FE267034e23aCcBD4940dfB4648e7C3A): Deposited USDC and WETH to borrow stETH
4. User D(0xCbe2195005c4B8692DbCCA5FA9511DE2eFa32C8d): Deposited WETH and borrowed USDC and stETH. After some blocks, repaid totally the USDC loan and redeemed partially the WETH deposit.
5. User E(0x0E10f9A63A7800fE4c657334dd6543068ab8A50D): Deposited WETH and borrowed stETH. After some blocks, repaid partially the stETH loan

After all these positions were created, the mock oracle was manipulated between blocks 18486558 and 18486586 by:
Initial prices set
- USDC price dropped at block 18486558
- USDC price increased at block 18486562
- USDC price restored
- WETH price dropped at block 18486569
- WETH price increased at block 18486573
- WETH price restored
- stETH price dropped at block 18486581
- stETH price increased at block 18486586
- stETH price restored

After that, there were multiple liquidations tests on this positions, so the current state of them is not this anymore.
