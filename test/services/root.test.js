import test from 'ava';
import Fastify from 'fastify';

import app from '../../src/app.js';

const fastify = Fastify();
fastify.register(app);

test.afterEach(() => {
  fastify.close();
});

test('get "hello world" response', async (check) => {
  const response = await fastify.inject({
    url: '/',
  });

  check.assert(response.statusCode === 200);
  check.regex(response.headers['content-type'], /application\/json/i);
  check.snapshot(response.json(), "response's body should be JSON");
});
