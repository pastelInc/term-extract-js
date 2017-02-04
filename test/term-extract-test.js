import test from 'ava'
import TermExtract from '../src/term-extract'
import { CalcImpotance } from '../src/impotance'

class MockImpotance extends CalcImpotance {
  constructor() {
    super()
  }
}

test.beforeEach(t => {
  t.context.termExtract = new TermExtract(new MockImpotance())
})

test('depends on CalcImpotance', t => {
  t.throws(TermExtract, TypeError)
})

test('should return length of zero', t => {
  t.is(t.context.termExtract.getImpWord().length, 0)
})
