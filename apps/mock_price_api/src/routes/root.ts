import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get(
    '/',
    {
      schema: {
        hide: true, // Hide from swagger docs
      },
    },
    async function (request, reply) {
      return reply.redirect('/docs');
    },
  );
};

export default root;
