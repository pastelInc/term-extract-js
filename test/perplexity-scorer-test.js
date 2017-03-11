import test from 'ava'
import MockAnalyser from './mock-analyser'
import PerplexityScorer from '../src/scorers/perplexity-scorer'
import { sentences } from './sentences'

test.beforeEach(t => {
  t.context.score = new PerplexityScorer(new MockAnalyser(sentences))
})

test('depends on NounFrequency', t => {
  t.throws(PerplexityScorer, TypeError)
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

test('should be adding concatenation pre frequency', t => {
  const expected = new Map([
    ['統計', [
      ['トライグラム', 2]
    ]],
    ['抽出', [
      ['トライグラム', 1]
    ]],
    ['トライグラム', [
      ['単語', 2],
      ['クラス', 1],
      ['文字', 1]
    ]]
  ])
  const statistics = t.context.score.preStatistics()

  t.deepEqual(Array.from(statistics.get('統計')), expected.get('統計'))
  t.deepEqual(Array.from(statistics.get('抽出')), expected.get('抽出'))
  t.deepEqual(Array.from(statistics.get('トライグラム')), expected.get('トライグラム'))
})

test('should be adding concatenation post frequency', t => {
  const expected = new Map([
    ['文字', [
      ['トライグラム', 1]
    ]],
    ['トライグラム', [
      ['統計', 2],
      ['抽出', 1],
    ]],
    ['クラス', [
      ['トライグラム', 1]
    ]],
    ['単語', [
      ['トライグラム', 2]
    ]]
  ])
  const statistics = t.context.score.postStatistics()

  t.deepEqual(Array.from(statistics.get('文字')), expected.get('文字'))
  t.deepEqual(Array.from(statistics.get('トライグラム')), expected.get('トライグラム'))
  t.deepEqual(Array.from(statistics.get('クラス')), expected.get('クラス'))
  t.deepEqual(Array.from(statistics.get('単語')), expected.get('単語'))
})

test('should have calculated entropy', t => {
  const expected = [
    ['トライグラム', 1.656604433192],
    ['統計', 0.2703100720721096],
    ['単語', 0.34657359027997264],
    ['クラス', 0.34657359027997264],
    ['抽出', 0.34657359027997264],
    ['文字', 0.34657359027997264]
  ]
  t.deepEqual(Array.from(t.context.score.statPerplexity), expected)
})

test('cannot find a compound noun', t => {
  t.is(t.context.score.find(''), 1)
})

test('find a compound noun', t => {
  t.is(t.context.score.find('トライグラム'), 0.828302216596)
  t.is(t.context.score.find('文字 トライグラム'), 0.5007945058679931)
})
