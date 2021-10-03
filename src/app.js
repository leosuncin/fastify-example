import { fileURLToPath } from 'node:url';
import process from 'node:process';
import Fastify from 'fastify';

import rootRoute from './services/root.js';

const fastify = Fastify({
  logger: process.env.NODE_ENV !== 'test',
});

fastify.register(rootRoute);

const modulePath = fileURLToPath(import.meta.url);
const scriptPath = process.argv[1];

// Check if this file is the main module
if (modulePath === scriptPath) {
  fastify.listen(process.env.PORT ?? 1337, (error) => {
    if (error) {
      fastify.log.error(error);
      process.exit(1);
    }
  });
}

export default fastify;
