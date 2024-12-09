import { FastifyPluginAsync } from 'fastify';

const healthRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    '/health',
    {
      schema: {
        tags: ['health'],
        description: 'Health check endpoint',
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              status: {
                type: 'string',
                description: 'The status of the API',
                example: 'ok',
              },
            },
          },
        },
      },
    },
    async () => {
      return { status: 'ok' };
    },
  );
};

export default healthRoute;
