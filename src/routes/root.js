export default async function (fastify, options) {
  fastify.get('/', (request, reply) => ({
    hello: 'world',
  }));
}
