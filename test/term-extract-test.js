import test from 'ava'
import TermExtract from '../src/term-extract'
import { FrequencyLeftRightScore, TypeLeftRightScore, PerplexityLeftRightScore } from '../src/left-right-score'
import { FrequencyScore, TermFrequencyScore } from '../src/frequency-score'
import MockFrequency from './mock-frequency'
import { sentences } from './sentences'

test('should return a score of frequency', t => {
  const termExtract = new TermExtract(
    new FrequencyLeftRightScore(new MockFrequency(sentences)),
    new FrequencyScore(new MockFrequency(sentences))
  )
  const expected = [
    ['トライグラム', 3],
    ['単語トライグラム', 2],
    ['トライグラム統計', 1],
    ['クラストライグラム', 1],
    ['トライグラム抽出', 1],
    ['単語トライグラム統計', 1],
    ['文字トライグラム', 1]
  ]

  t.deepEqual(Array.from(termExtract.calculateFrequency()), expected)
})

test('should return a score of term frequency', t => {
  const termExtract = new TermExtract(
    new FrequencyLeftRightScore(new MockFrequency(sentences)),
    new TermFrequencyScore(new MockFrequency(sentences))
  )
  const expected = [
    ['トライグラム', 10],
    ['単語トライグラム', 3],
    ['トライグラム統計', 2],
    ['クラストライグラム', 1],
    ['トライグラム抽出', 1],
    ['単語トライグラム統計', 1],
    ['文字トライグラム', 1]
  ]

  t.deepEqual(Array.from(termExtract.calculateFrequency()), expected)
})

test('should have calculated LF of frequency and frequency', t => {
  const termExtract = new TermExtract(
    new FrequencyLeftRightScore(new MockFrequency(sentences)),
    new FrequencyScore(new MockFrequency(sentences))
  )
  const expected = [
    ['トライグラム', 14.696938456699067],
    ['単語トライグラム', 6.260338320293149],
    ['トライグラム統計', 2.9129506302439405],
    ['クラストライグラム', 2.6321480259049848],
    ['トライグラム抽出', 2.6321480259049848],
    ['文字トライグラム', 2.6321480259049848],
    ['単語トライグラム統計', 2.5697965868506505]
  ]

  t.deepEqual(Array.from(termExtract.calculateFLR()), expected)
})

test('should have calculated LF of frequency and term frequency', t => {
  const termExtract = new TermExtract(
    new FrequencyLeftRightScore(new MockFrequency(sentences)),
    new TermFrequencyScore(new MockFrequency(sentences))
  )
  const expected = [
    ['トライグラム', 48.98979485566356],
    ['単語トライグラム', 9.390507480439723],
    ['トライグラム統計', 5.825901260487881],
    ['クラストライグラム', 2.6321480259049848],
    ['トライグラム抽出', 2.6321480259049848],
    ['文字トライグラム', 2.6321480259049848],
    ['単語トライグラム統計', 2.5697965868506505]
  ]

  t.deepEqual(Array.from(termExtract.calculateFLR()), expected)
})

test('should have calculated type of frequency and frequency', t => {
  const termExtract = new TermExtract(
    new TypeLeftRightScore(new MockFrequency(sentences)),
    new FrequencyScore(new MockFrequency(sentences))
  )
  const expected = [
    ['トライグラム', 10.392304845413264],
    ['単語トライグラム', 4.426727678801287],
    ['トライグラム統計', 2.2133638394006434],
    ['クラストライグラム', 2.2133638394006434],
    ['トライグラム抽出', 2.2133638394006434],
    ['文字トライグラム', 2.2133638394006434],
    ['単語トライグラム統計', 1.906368585993873]
  ]

  t.deepEqual(Array.from(termExtract.calculateFLR()), expected)
})

test('should have calculated type of frequency and term frequency', t => {
  const termExtract = new TermExtract(
    new TypeLeftRightScore(new MockFrequency(sentences)),
    new TermFrequencyScore(new MockFrequency(sentences))
  )
  const expected = [
    ['トライグラム', 34.64101615137754],
    ['単語トライグラム', 6.64009151820193],
    ['トライグラム統計', 4.426727678801287],
    ['クラストライグラム', 2.2133638394006434],
    ['トライグラム抽出', 2.2133638394006434],
    ['文字トライグラム', 2.2133638394006434],
    ['単語トライグラム統計', 1.906368585993873]
  ]

  t.deepEqual(Array.from(termExtract.calculateFLR()), expected)
})

test('should have calculated perplexity of frequency and frequency', t => {
  const termExtract = new TermExtract(
    new PerplexityLeftRightScore(new MockFrequency(sentences)),
    new FrequencyScore(new MockFrequency(sentences))
  )
  const expected = [
    ['トライグラム', 3.194987500240385],
    ['単語トライグラム', 2.3074562508413488],
    ['クラストライグラム', 1.7224937501201927],
    ['トライグラム抽出', 1.7224937501201927],
    ['文字トライグラム', 1.7224937501201927],
    ['トライグラム統計', 1.6949875002403856],
    ['単語トライグラム統計', 1.5466583334935902]
  ]

  t.deepEqual(Array.from(termExtract.calculateFLR()), expected)
})

test('should have calculated perplexity of frequency and term frequency', t => {
  const termExtract = new TermExtract(
    new PerplexityLeftRightScore(new MockFrequency(sentences)),
    new TermFrequencyScore(new MockFrequency(sentences))
  )
  const expected = [
    ['トライグラム', 4.654419118877683],
    ['単語トライグラム', 2.7224937501201922],
    ['トライグラム統計', 2.279950000961542],
    ['クラストライグラム', 1.7224937501201927],
    ['トライグラム抽出', 1.7224937501201927],
    ['文字トライグラム', 1.7224937501201927],
    ['単語トライグラム統計', 1.5466583334935902]
  ]

  t.deepEqual(Array.from(termExtract.calculateFLR()), expected)
})
