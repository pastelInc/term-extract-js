import test from 'ava'
import MockAnalyser from './mock-analyser'
import FrequencyScorer from '../src/scorers/frequency-scorer'
import { sentences } from './sentences'

test.beforeEach(t => {
  t.context.score = new FrequencyScorer(new MockAnalyser(sentences))
})

test('depends on NounFrequency', t => {
  t.throws(FrequencyScorer, TypeError)
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
  t.deepEqual(Array.from(t.context.score.stat), expected)
})

test('cannot find a compound noun', t => {
  t.is(t.context.score.find(''), 1)
})

test('find a compound noun', t => {
  t.is(t.context.score.find('トライグラム'), 4.898979485566356)
  t.is(t.context.score.find('トライグラム 統計'), 2.9129506302439405)
  t.is(t.context.score.find('単語 トライグラム'), 3.1301691601465746)
})
