import test from 'ava';

import LowDB from '../../src/plugins/lowdb.js';
import { buildWith } from '../../src/utils/test.js';

test('database creation', async (t) => {
  const instance = await buildWith(LowDB);

  t.assert('db' in instance);
  t.assert('todos' in instance.db.data);
});
