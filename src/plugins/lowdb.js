import plugin from 'fastify-plugin';
// eslint-disable-next-line import/no-unresolved
import { Low } from 'lowdb';

/**
 * This plugin adds LowDB to Fastify
 */
export default plugin(async function (fastify, { adapter }) {
  const database = new Low(adapter);

  await database.read();

  database.data = database.data || { todos: {} };

  await database.write();

  fastify.decorate('db', database);
});
