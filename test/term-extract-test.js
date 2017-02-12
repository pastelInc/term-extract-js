import test from 'ava'
import TermExtract from '../src/term-extract'
import { CalcImportance } from '../src/importance'

class MockImportance extends CalcImportance {
  constructor() {
    super()
  }
}

test.beforeEach(t => {
  t.context.termExtract = new TermExtract(new MockImportance())
})

test('depends on CalcImportance', t => {
  t.throws(TermExtract, TypeError)
})

test('should return length of zero', t => {
  t.is(t.context.termExtract.getImpWord().length, 0)
})
