import test from 'ava';

import { buildApp } from '../../src/utils/test.js';

const app = buildApp();

test.afterEach(() => {
  app.close();
});

test('get "hello world" response', async (check) => {
  const response = await app.inject({
    url: '/',
  });

  check.assert(response.statusCode === 200);
  check.regex(response.headers['content-type'], /application\/json/i);
  check.snapshot(response.json(), "response's body should be JSON");
});
