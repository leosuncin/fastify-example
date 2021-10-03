import Fastify from 'fastify';

import rootRoute from './services/root.js';

const fastify = Fastify({
  logger: true,
});

fastify.register(rootRoute);

fastify.listen(process.env.PORT ?? 1337, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
