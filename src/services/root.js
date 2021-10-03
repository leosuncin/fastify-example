export default function (fastify, options, next) {
  fastify.get('/', (request, reply) => ({
    hello: 'world',
  }));

  next();
}
