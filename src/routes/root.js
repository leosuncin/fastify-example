import { getMessage } from '../schemas/root.js';

/**
 * Root routes
 *
 * @type {import('fastify').FastifyPluginAsync}
 */
export default async function (fastify) {
  fastify.get('/', { schema: getMessage }, () => ({
    hello: 'world',
  }));
}
