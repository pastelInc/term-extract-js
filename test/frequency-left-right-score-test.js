import test from 'ava'
import MockFrequency from './mock-frequency'
import { FrequencyLeftRightScore } from '../src/left-right-score'

const sentences = `トライグラム 統計、トライグラム、単語 トライグラム、クラス トライグラム、単語 トライグラム、トライグラム、トライグラム 抽出、単語 トライグラム 統計、トライグラム、文字 トライグラム`

test.beforeEach(t => {
  t.context.score = new FrequencyLeftRightScore(new MockFrequency(sentences))
})

test('depends on NounFrequency', t => {
  t.throws(FrequencyLeftRightScore, TypeError)
})

test('should be adding concatenation frequency', t => {
  const expected = [
    ['トライグラム', [3, 5]],
    ['統計', [0, 2]],
    ['単語', [3, 0]],
    ['クラス', [1, 0]],
    ['抽出', [0, 1]],
    ['文字', [1, 0]]
  ]
  t.deepEqual(Array.from(t.context.score.statistics()), expected)
})

test('cannot find a compound noun', t => {
  t.is(t.context.score.frequency(''), 1)
})

test('find a compound noun', t => {
  t.is(t.context.score.frequency('トライグラム'), 4.898979485566356)
  t.is(t.context.score.frequency('トライグラム 統計'), 2.9129506302439405)
  t.is(t.context.score.frequency('単語 トライグラム'), 3.1301691601465746)
})
