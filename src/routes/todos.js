import {
  createOne,
  findAll,
  getOne,
  removeOne,
  updateOne,
} from '../schemas/todos.js';

export const autoPrefix = '/todos';

/**
 * ToDo routes
 *
 * @type {import('fastify').FastifyPluginAsync}
 */
export default async function (fastify) {
  fastify.addHook('preHandler', async (request) => {
    const { id } = request.params;

    if (id) {
      const { [id]: todo } = fastify.db.data.todos;

      if (!todo) {
        fastify.assert.ok(todo, 404, `Not found any todo with id: ${id}`);
      }

      request.todo = todo;
    }
  });

  fastify.post('/', { schema: createOne }, async (request, reply) => {
    const { text } = request.body;
    const todo = {
      id: Date.now().toString(16),
      text,
      done: false,
    };

    fastify.db.data.todos[todo.id] = todo;
    await fastify.db.write();
    reply.code(201);

    return todo;
  });

  fastify.get('/', { schema: findAll }, () =>
    Object.values(fastify.db.data.todos),
  );

  fastify.get('/:id', { schema: getOne }, (request) => request.todo);

  fastify.put('/:id', { schema: updateOne }, async (request) => {
    const {
      todo,
      body: { text = todo.text, done = todo.done },
    } = request;

    if (text !== todo.text || done !== todo.done) {
      Object.assign(todo, { text, done });
      fastify.db.data.todos[todo.id] = todo;

      await fastify.db.write();
    }

    return todo;
  });

  fastify.delete('/:id', { schema: removeOne }, async (request, reply) => {
    delete fastify.db.data.todos[request.todo.id];
    await fastify.db.write();

    reply.code(204).send();
  });
}
