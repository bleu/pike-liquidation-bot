# Pike Liquidation Bot

A reference implementation of a liquidation bot for Pike Markets, composed by three applications and supporting smart contracts.

## Important Notes

This codebase was developed before the launch of Pike Markets, which means:
- Smart contract implementations may differ from production versions
- All addresses are testnet-based (Base Sepolia)
- Some components may be superseded by official Pike tools (SDK, indexers, etc.)
- Token and price data are mocked for testing purposes

## System Architecture

The system consists of one bot application and a supporting smart contract layer for more advanced liquidation operations. The Liquidation Bot serves as the active component that monitors and executes liquidation opportunities using data from the Pike Indexer Backend.

## Getting Started

### Prerequisites

This project uses `pnpm` as its package manager. Install it globally before proceeding:

```bash
npm install -g pnpm
```

### Installation

```bash
pnpm install
```

### Development Setup

Launch the components in the following order:

1. **Mock Price API**:
   ```bash
   cd apps/mock_price_api
   pnpm dev
   # Available at http://localhost:3000
   ```

2. **Liquidation Bot**:
   ```bash
   cd apps/bot
   pnpm dev
   ```

## Component Details


### Mock Price API

The Mock Price API is designed specifically for development and testing purposes. It maintains a cache of oracle price data and provides endpoints for both reading and updating prices. The API includes a POST method that allows for price value modifications and oracle updates. In a production environment, this component should be replaced with a more robust and production-grade price API system. An off-chain system was selected instead of on-chain price information since we can consume the data in a higher frequency.

### Liquidator Smart Contracts

The liquidator contracts implement a sophisticated system for executing liquidations efficiently. They leverage [Uniswap V3 swap callbacks](https://docs.uniswap.org/contracts/v3/reference/core/interfaces/callback/IUniswapV3SwapCallback) for flash loan functionality, incorporating slippage protection mechanisms to ensure safe execution. For testing purposes, the Uniswap V3 implementation has been simplified to a pool that exchanges tokens based on the same oracle used by Pike Markets.

### Liquidation Bot

The Liquidation Bot acts as the primary active component in the system, continuously monitoring both prices and positions for liquidation opportunities. It can be configured with various parameters including minimum profit thresholds in USD, minimum collateral position sizes, and custom monitoring settings to optimize its operation based on specific requirements and market conditions.

## Production Considerations

For production deployment, there are some improvements to be made to ensure the system's reliability, efficiency, and profitability. Here are the key areas requiring development:s

### MEV Protection

In the current DeFi landscape, MEV protection is crucial for maintaining profitable operations. The system needs robust strategies to prevent value extraction through sandwich attacks, where attackers manipulate token prices before and after our transactions. Additionally, implementing front-running resistance mechanisms will help ensure our liquidation transactions aren't preempted by other market participants. This includes techniques such as using private transaction pools, implementing timing variations, and potentially utilizing flashbots or similar services.

### Capital Efficiency

To maximize returns, the system needs sophisticated capital management strategies. This includes implementing cross-DEX arbitrage detection to identify the most profitable liquidation paths across multiple decentralized exchanges. In this example, this is only handled by 1 Uniswap pool, but it can be improved to get the best price possible. The flash loan strategy should be enhanced to consider multiple lending protocols and token paths, optimizing for gas costs and potential slippage. The system should also maintain optimal capital reserves for different market conditions, balancing between immediate availability for opportunities and minimizing idle capital.

### Transaction Management

Reliable transaction execution is critical for production operations. The system needs to handle chain reorganizations gracefully, ensuring that our liquidation transaction is the first one when it is possible. This includes adding more gas and have one component that can estimate it properly. In addition, a better understanding of when the price update will be made so the liquidation transaction can be included as soon as possible.

### Risk Management

A risk management framework is also needed for sustainable operations. This includes developing position sizing algorithms that consider market volatility, liquidity conditions, and potential slippage to evaluates each liquidation opportunity against potential downsides, including gas costs, price impact, and execution risks. Portfolio management strategies should be developed to maintain a balanced exposure across different tokens and protocols, while considering correlation risks and market conditions.
