/**
 * @type {import('fastify').FastifySchema}
 */
export const getMessage = {
  response: {
    200: {
      type: 'object',
      properties: {
        hello: { type: 'string' },
      },
    },
  },
};
