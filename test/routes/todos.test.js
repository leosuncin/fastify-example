import test from 'ava';

import { buildApp } from '../../src/utils/test.js';

const app = buildApp();
const todos = {
  '00000000001': {
    id: '00000000001',
    text: 'Swipe card',
    done: false,
  },
  '00000000002': {
    id: '00000000002',
    text: 'Fix Wiring',
    done: false,
  },
  '00000000003': {
    id: '00000000003',
    text: 'Insert Keys',
    done: false,
  },
};

test.beforeEach(async () => {
  await app.ready();
  app.db.data.todos = todos;
  await app.db.write();
});

test.afterEach(() => {
  app.close();
});

test('create one todo', async (t) => {
  const payload = { text: 'Scan Boarding Pass' };
  const response = await app.inject({
    url: '/todos',
    method: 'POST',
    payload,
  });

  t.is(response.statusCode, 201);

  const todo = response.json();

  t.assert(typeof todo.id === 'string');
  t.is(todo.text, payload.text);
  t.is(todo.done, false);
});

test('validation when create new one', async (t) => {
  const payload = { text: '' };
  const response = await app.inject({
    url: '/todos',
    method: 'POST',
    payload,
  });

  t.is(response.statusCode, 400);
  t.snapshot(response.json(), 'validation error');
});

test('find all todo', async (t) => {
  const response = await app.inject({
    url: '/todos',
  });

  t.is(response.statusCode, 200);
  t.true(Array.isArray(response.json()));
});

test('get one todo', async (t) => {
  const todo = todos['00000000001'];
  const response = await app.inject({
    url: `/todos/${todo.id}`,
  });

  t.is(response.statusCode, 200);
  t.deepEqual(response.json(), todo);
});

/**
 * @param {import('ava').ExecutionContext} t
 * @param {object} payload
 */
async function updateTodoMacro(t, payload) {
  const todo = todos['00000000002'];
  const response = await app.inject({
    url: `/todos/${todo.id}`,
    method: 'PUT',
    payload,
  });

  t.is(response.statusCode, 200);
  t.deepEqual(response.json(), { ...todo, ...payload });
}
updateTodoMacro.title = (providedTitle = 'update one todo', payload) =>
  `${providedTitle} with ${JSON.stringify(payload)}`;

test(updateTodoMacro, {});
test(updateTodoMacro, { text: 'Make a sandwich' });
test(updateTodoMacro, { done: true });
test(updateTodoMacro, { text: 'sudo "make a sandwich"', done: true });

test('remove one todo', async (t) => {
  const todo = todos['00000000003'];
  const response = await app.inject({
    url: `/todos/${todo.id}`,
    method: 'DELETE',
  });

  t.is(response.statusCode, 204);
});

/**
 * @param {import('ava').ExecutionContext} t
 * @param {'GET'|'PUT'|'DELETE'} [method='GET']
 * @param {object} [payload]
 */
async function notFoundMacro(t, method = 'GET', payload) {
  const response = await app.inject({
    url: '/todos/ffffffffff0',
    method,
    payload,
  });

  t.is(response.statusCode, 404);
  t.snapshot(response.json(), 'not found error');
}

test('fail to get an inexistent todo', notFoundMacro);
test('fail to update an inexistent todo', notFoundMacro, 'PUT', {});
test('fail to remove inexistent todo', notFoundMacro, 'DELETE');
