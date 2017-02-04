import test from 'ava'
import MeCabFrequency from '../src/noun-frequency'

test.beforeEach(t => {
  t.context.meCab = new MeCabFrequency()
})

test('my passed test case', t => {
  t.pass()
})
