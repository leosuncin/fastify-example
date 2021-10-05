import test from 'ava';
import pactum from 'pactum';

import { todo } from '../src/schemas/todos.js';

test.before(() => {
  pactum.request.setBaseUrl(process.env.BASE_URL ?? 'http://localhost:3000');
  pactum.response.setDefaultExpectResponseTime(100);
});

const testCase = pactum.e2e('Todo CRUD');
const isString = 'typeof $V === "string"';

test.after(async () => {
  await testCase.cleanup();
});

test.serial('create a new todo', async (t) => {
  const text = 'Make a sandwich';

  await testCase
    .step('Add todo')
    .spec()
    .post('/todos')
    .withJson({ text })
    .expectStatus(201)
    .expectJsonLike({
      id: isString,
      text,
      done: false,
    })
    .expectJsonSchema(todo)
    .stores('todoId', '.id')
    .clean()
    .delete('/todos/$S{todoId}')
    .expectStatus(204);

  t.pass();
});

test.serial('find all todo', async (t) => {
  await testCase
    .step('Find all')
    .spec()
    .get('/todos')
    .expectStatus(200)
    .expectJsonLike('$V.length >= 1')
    .expectJsonSchema({
      type: 'array',
      items: todo,
    });

  t.pass();
});

test.serial('get one todo', async (t) => {
  await testCase
    .step('Get todo')
    .spec()
    .get(`/todos/{id}`)
    .withPathParams('id', '$S{todoId}')
    .expectStatus(200)
    .expectJsonSchema(todo);

  t.pass();
});

test.serial('toggle one todo', async (t) => {
  const done = true;

  await testCase
    .step('Update todo')
    .spec()
    .put(`/todos/{id}`)
    .withPathParams('id', '$S{todoId}')
    .withJson({ done })
    .expectStatus(200)
    .expectJsonLike({ done })
    .expectJsonSchema(todo);

  t.pass();
});

test('fail to create with invalid data', async (t) => {
  await pactum
    .spec()
    .name('empty object')
    .post('/todos')
    .withJson({})
    .expectStatus(400)
    .expectJson({
      statusCode: 400,
      error: 'Bad Request',
      message: "body should have required property 'text'",
    });

  await pactum
    .spec()
    .name('short text')
    .post('/todos')
    .withJson({ text: 'ab' })
    .expectStatus(400)
    .expectJson({
      statusCode: 400,
      error: 'Bad Request',
      message: 'body.text should NOT be shorter than 3 characters',
    });

  t.pass();
});

test('fail with inexistent todo', async (t) => {
  const url = '/todos/ffffffffff0';
  const error = {
    statusCode: 404,
    error: 'Not Found',
    message: 'Not found any todo with id: ffffffffff0',
  };

  await pactum
    .spec()
    .name('fail to get an inexistent todo')
    .get(url)
    .expectStatus(404)
    .expectJson(error);
  await pactum
    .spec()
    .name('fail to update an inexistent todo')
    .put(url)
    .withJson({})
    .expectStatus(404)
    .expectJson(error);
  await pactum
    .spec()
    .name('fail to remove inexistent todo')
    .delete(url)
    .expectStatus(404)
    .expectJson(error);

  t.pass();
});
