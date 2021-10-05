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

  fastify.get('/:id', { schema: getOne }, (request, reply) => {
    const { id } = request.params;
    const { [id]: todo } = fastify.db.data.todos;

    if (!todo) {
      return reply.notFound(`Not found any todo with id: ${id}`);
    }

    return todo;
  });

  fastify.put('/:id', { schema: updateOne }, async (request, reply) => {
    const { id } = request.params;
    const { [id]: todo } = fastify.db.data.todos;

    if (!todo) {
      return reply.notFound(`Not found any todo with id: ${id}`);
    }

    const { text = todo.text, done = todo.done } = request.body;

    if (text !== todo.text || done !== todo.done) {
      Object.assign(todo, { text, done });
      fastify.db.data.todos[todo.id] = todo;

      await fastify.db.write();
    }

    return todo;
  });

  fastify.delete('/:id', { schema: removeOne }, async (request, reply) => {
    const { id } = request.params;
    const { [id]: todo } = fastify.db.data.todos;

    if (!todo) {
      return reply.notFound(`Not found any todo with id: ${id}`);
    }

    delete fastify.db.data.todos[todo.id];
    await fastify.db.write();

    reply.code(204).send();
  });
}
