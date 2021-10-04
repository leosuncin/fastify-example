import Fastify from 'fastify';
import plugin from 'fastify-plugin';
// eslint-disable-next-line import/no-unresolved
import { Memory } from 'lowdb';

import App from '../app.js';

export function config() {
  return {
    adapter: new Memory(),
  };
}

export function buildApp() {
  const app = Fastify();

  /*
   * fastify-plugin ensures that all decorators
   * are exposed for testing purposes, this is
   * different from the production setup
   */
  app.register(plugin(App), config());

  return app;
}

export async function buildWith(Plugin) {
  const instance = Fastify();

  instance.register(Plugin, config());

  await instance.ready();

  return instance;
}
