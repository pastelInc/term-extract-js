import test from 'ava'
import { HashPerplexityImportance } from '../src/importance'

test.beforeEach(t => {
  t.context.imp = new HashPerplexityImportance()
})

test('my passing test', t => {
  t.pass()
})
