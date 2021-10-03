import plugin from 'fastify-plugin';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default plugin(async function (fastify, options) {
  fastify.register(await import('fastify-sensible'), {
    errorHandler: false,
  });
});
