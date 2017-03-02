import test from 'ava'
import MockFrequency from './mock-frequency'
import { TermFrequencyScore } from '../src/frequency-score'
import { sentences } from './sentences'

test.beforeEach(t => {
  t.context.score = new TermFrequencyScore(new MockFrequency(sentences))
})

test('depends on NounFrequency', t => {
  t.throws(TermFrequencyScore, TypeError)
})

test('should return zero', t => {
  t.is(t.context.score.frequency(''), 0)
})

test('calculate a frequency of left concatenated simple nouns', t => {
  t.is(t.context.score.frequency('単語 トライグラム'), 3)
})

test('calculate a frequency of right concatenated simple nouns', t => {
  t.is(t.context.score.frequency('トライグラム 統計'), 2)
})
