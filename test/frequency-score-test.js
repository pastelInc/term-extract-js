import test from 'ava'
import MockFrequency from './mock-frequency'
import { FrequencyScore } from '../src/frequency-score'

const sentences = `トライグラム 統計、トライグラム、単語 トライグラム、クラス トライグラム、単語 トライグラム、トライグラム、トライグラム 抽出、単語 トライグラム 統計、トライグラム、文字 トライグラム`

test.beforeEach(t => {
  t.context.score = new FrequencyScore(new MockFrequency())
})

test('depends on NounFrequency', t => {
  t.throws(FrequencyScore, TypeError)
})

test('should return zero', t => {
  t.is(t.context.score.frequency('', sentences), 0)
})

test('calculate a frequency of left concatenated simple nouns', t => {
  t.is(t.context.score.frequency('単語 トライグラム', sentences), 2)
})

test('calculate a frequency of right concatenated simple nouns', t => {
  t.is(t.context.score.frequency('トライグラム 統計', sentences), 1)
})
