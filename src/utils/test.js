import Fastify from 'fastify';
import plugin from 'fastify-plugin';

import App from '../app.js';

export function config() {
  return {};
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
