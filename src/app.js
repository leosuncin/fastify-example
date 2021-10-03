import path from 'node:path';
import { fileURLToPath } from 'node:url';
import autoload from 'fastify-autoload';

export default async function (fastify, options) {
  const dirname = path.dirname(fileURLToPath(import.meta.url));

  fastify.register(autoload, {
    dir: path.join(dirname, 'routes'),
    options: { ...options },
  });
}
