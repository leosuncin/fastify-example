import test from 'ava';
import pactum from 'pactum';

import { getMessage } from '../src/schemas/root.js';

test.before(() => {
  pactum.request.setBaseUrl(process.env.BASE_URL ?? 'http://localhost:3000');
});

test('GET /', async (t) => {
  await pactum
    .spec()
    .get('/')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJson({
      hello: 'world',
    })
    .expectJsonSchema(getMessage.response[200])
    .expectResponseTime(100);

  t.pass();
});
