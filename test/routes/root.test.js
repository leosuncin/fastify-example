import test from 'ava';

import { buildApp } from '../../src/utils/test.js';

const app = buildApp();

test.afterEach(() => {
  app.close();
});

test('get "hello world" response', async (t) => {
  const response = await app.inject({
    url: '/',
  });

  t.assert(response.statusCode === 200);
  t.regex(response.headers['content-type'], /application\/json/i);
  t.snapshot(response.json(), "response's body should be JSON");
});
