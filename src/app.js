import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' });
});

fastify.listen(process.env.PORT ?? 1337, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
