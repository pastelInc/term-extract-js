import test from 'ava'
import MockFrequency from './mock-frequency'
import { TypeLeftRightScore } from '../src/left-right-score'
import { sentences } from './sentences'

test.beforeEach(t => {
  t.context.score = new TypeLeftRightScore(new MockFrequency(sentences))
})

test('depends on NounFrequency', t => {
  t.throws(TypeLeftRightScore, TypeError)
})

test('should be adding concatenation type', t => {
  const expected = [
    ['トライグラム', [2, 3]],
    ['統計', [0, 1]],
    ['単語', [1, 0]],
    ['クラス', [1, 0]],
    ['抽出', [0, 1]],
    ['文字', [1, 0]]
  ]
  t.deepEqual(Array.from(t.context.score.stat), expected)
})

test('cannot find a compound noun', t => {
  t.is(t.context.score.frequency(''), 1)
})

test('find a compound noun', t => {
  t.is(t.context.score.frequency('トライグラム'), 3.4641016151377544)
  t.is(t.context.score.frequency('トライグラム 統計'), 2.2133638394006434)
  t.is(t.context.score.frequency('単語 トライグラム'), 2.2133638394006434)
})
