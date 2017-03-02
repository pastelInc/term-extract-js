import test from 'ava'
import MockFrequency from './mock-frequency'
import { FrequencyScore } from '../src/frequency-score'
import { sentences } from './sentences'

test.beforeEach(t => {
  t.context.score = new FrequencyScore(new MockFrequency(sentences))
})

test('depends on NounFrequency', t => {
  t.throws(FrequencyScore, TypeError)
})

test('should return zero', t => {
  t.is(t.context.score.frequency(''), 0)
})

test('calculate a frequency of left concatenated simple nouns', t => {
  t.is(t.context.score.frequency('単語 トライグラム'), 2)
})

test('calculate a frequency of right concatenated simple nouns', t => {
  t.is(t.context.score.frequency('トライグラム 統計'), 1)
})
