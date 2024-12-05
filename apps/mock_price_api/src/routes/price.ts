import { FastifyPluginAsync } from 'fastify';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import { AddressSchema, PriceSchema } from '../schemas';
import { apiContainer } from '../inversify.config';
import { PriceService, priceServiceSymbol } from '@/services/oracle';

const getParamsSchema = {
  type: 'object',
  required: ['assetAddress'],
  additionalProperties: false,
  properties: {
    assetAddress: AddressSchema,
  },
} as const satisfies JSONSchema;

const getSuccessSchema = {
  type: 'object',
  required: ['success', 'data'],
  additionalProperties: false,
  properties: {
    success: {
      type: 'boolean',
    },
    data: {
      type: 'object',
      required: ['assetAddress', 'price', 'timestamp'],
      properties: {
        assetAddress: AddressSchema,
        price: PriceSchema,
        timestamp: {
          type: 'number',
          description: 'Unix timestamp in milliseconds',
        },
      },
    },
  },
} as const satisfies JSONSchema;

const postBodySchema = {
  type: 'object',
  required: ['assetAddress', 'newPrice'],
  additionalProperties: false,
  properties: {
    assetAddress: AddressSchema,
    newPrice: {
      type: 'number',
      description: 'New price value',
    },
  },
} as const satisfies JSONSchema;

const errorSchema = {
  type: 'object',
  required: ['success', 'error'],
  additionalProperties: false,
  properties: {
    success: {
      type: 'boolean',
    },
    error: {
      type: 'string',
      description: 'Error message',
    },
  },
} as const satisfies JSONSchema;

type GetRouteParams = FromSchema<typeof getParamsSchema>;
type GetRouteResponse = FromSchema<typeof getSuccessSchema>;
type PostRouteBody = FromSchema<typeof postBodySchema>;
type ErrorResponse = FromSchema<typeof errorSchema>;

const priceService: PriceService = apiContainer.get(priceServiceSymbol);

const priceRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get<{
    Params: GetRouteParams;
    Reply: GetRouteResponse | ErrorResponse;
  }>(
    '/price/:assetAddress',
    {
      schema: {
        tags: ['price'],
        description: 'Get price for an asset',
        params: getParamsSchema,
        response: {
          200: getSuccessSchema,
          400: errorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { assetAddress } = request.params;
        const price = await priceService.getPrice(assetAddress as `0x${string}`);

        return {
          success: true,
          data: {
            assetAddress,
            price: price.toString(),
            timestamp: Date.now(),
          },
        };
      } catch (error) {
        reply.status(400);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    },
  );

  fastify.post<{
    Body: PostRouteBody;
    Reply: GetRouteResponse | ErrorResponse;
  }>(
    '/price',
    {
      schema: {
        tags: ['price'],
        description: 'Set price for an asset',
        body: postBodySchema,
        response: {
          200: getSuccessSchema,
          400: errorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { assetAddress, newPrice } = request.body;
        const result = await priceService.setPrice(assetAddress as `0x${string}`, newPrice);

        return {
          success: true,
          data: {
            assetAddress,
            price: result.cachedPrice.toString(),
            timestamp: Date.now(),
          },
        };
      } catch (error) {
        reply.status(400);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    },
  );
};

export default priceRoute;
