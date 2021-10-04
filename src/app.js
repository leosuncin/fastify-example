import autoload from 'fastify-autoload';
// eslint-disable-next-line import/no-unresolved
import { JSONFile } from 'lowdb';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('fastify').FastifyPluginAsync} */
export default async function (fastify, options) {
  const dirname = path.dirname(fileURLToPath(import.meta.url));

  /*
   * This loads all plugins defined in plugins
   * those should be support plugins that are reused
   * through your application
   */
  fastify.register(autoload, {
    dir: path.join(dirname, 'plugins'),
    options: {
      adapter: new JSONFile(path.join(dirname, '..', 'db.json')),
      ...options,
    },
  });

  /*
   * This loads all plugins defined in routes
   * define your routes in one of these
   */
  fastify.register(autoload, {
    dir: path.join(dirname, 'routes'),
    options: { ...options },
  });
}
