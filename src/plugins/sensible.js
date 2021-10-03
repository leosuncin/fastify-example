import plugin from 'fastify-plugin';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default plugin(async function (fastify) {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  fastify.register(await import('fastify-sensible'), {
    errorHandler: false,
  });
});
