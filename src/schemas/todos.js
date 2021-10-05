export const todo = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    text: { type: 'string' },
    done: { type: 'boolean' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  required: ['id', 'text', 'done'],
};

const idParameter = {
  type: 'object',
  properties: {
    id: { type: 'string', pattern: '^[0-9a-f]{11}$' },
  },
  required: ['id'],
};

/**
 * @type {import('fastify').FastifySchema}
 */
export const createOne = {
  body: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        minLength: 3,
      },
    },
    required: ['text'],
    additionalProperties: false,
  },
  response: {
    201: todo,
  },
};

/**
 * @type {import('fastify').FastifySchema}
 */
export const findAll = {
  response: {
    200: {
      type: 'array',
      items: todo,
    },
  },
};

/**
 * @type {import('fastify').FastifySchema}
 */
export const getOne = {
  params: idParameter,
  response: {
    200: todo,
  },
};

/**
 * @type {import('fastify').FastifySchema}
 */
export const updateOne = {
  params: idParameter,
  body: {
    type: 'object',
    properties: {
      text: { type: ['string', 'null'] },
      done: { type: ['boolean', 'null'] },
    },
    additionalProperties: false,
  },
  response: {
    200: todo,
  },
};

/**
 * @type {import('fastify').FastifySchema}
 */
export const removeOne = {
  params: idParameter,
  response: {
    204: {
      type: 'null',
    },
  },
};
