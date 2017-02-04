import test from 'ava'
import { HashImpotance, HashFreqImpotance, HashPerplexityImpotance, HashTFImpotance } from '../src/impotance'

test.beforeEach(t => {
  t.context.imp = new HashImpotance()
  t.context.freqImp = new HashFreqImpotance()
  t.context.ppImp = new HashPerplexityImpotance()
  t.context.tFImp = new HashTFImpotance()
})

test('my passed test case', t => {
  t.pass()
})
