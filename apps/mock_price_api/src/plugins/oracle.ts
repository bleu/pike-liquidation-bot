import { FastifyPluginAsync } from 'fastify';
import { PriceService, priceServiceSymbol } from '../services/oracle';
import { apiContainer } from '../inversify.config.js';

const oraclePlugin: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Get service from container
  const priceService = apiContainer.get<PriceService>(priceServiceSymbol);

  // Decorate fastify instance with oracle
  fastify.decorate('oracle', priceService);
};

export default oraclePlugin;
