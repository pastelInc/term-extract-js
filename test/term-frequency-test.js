import test from 'ava'
import MockAnalyser from './mock-analyser'
import TermFrequency from '../src/frequencies/term-frequency'
import { sentences } from './sentences'

test.beforeEach(t => {
  t.context.score = new TermFrequency(new MockAnalyser(sentences))
})

test('depends on NounFrequency', t => {
  t.throws(TermFrequency, TypeError)
})

test('should return zero', t => {
  t.is(t.context.score.find(''), 0)
})

test('calculate a frequency of left concatenated simple nouns', t => {
  t.is(t.context.score.find('単語 トライグラム'), 3)
})

test('calculate a frequency of right concatenated simple nouns', t => {
  t.is(t.context.score.find('トライグラム 統計'), 2)
})
