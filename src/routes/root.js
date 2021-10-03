/**
 * Root routes
 *
 * @type {import('fastify').FastifyPluginAsync}
 */
export default async function (fastify) {
  /**
   * @type {import('fastify').RouteShorthandOptions}
   */
  const options = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
          },
        },
      },
    },
  };

  fastify.get('/', options, () => ({
    hello: 'world',
  }));
}
