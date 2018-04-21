import test from 'ava'
import td from 'testdouble'
import TermExtract from '../src/term-extract'
import TypeScorer from '../src/scorers/type-scorer'
import FrequencyScorer from '../src/scorers/frequency-scorer'
import PerplexityScorer from '../src/scorers/perplexity-scorer'
import Frequency from '../src/frequencies/frequency'
import TermFrequency from '../src/frequencies/term-frequency'
import MockAnalyser from './mock-analyser'
import { sentences } from './sentences'
import Config from '../src/config'

test('should return a frequency', t => {
  const expected = [
    ['トライグラム', 3],
    ['単語トライグラム', 2],
    ['トライグラム統計', 1],
    ['クラストライグラム', 1],
    ['トライグラム抽出', 1],
    ['単語トライグラム統計', 1],
    ['文字トライグラム', 1]
  ]
  const FakeConfig = td.constructor(Config)
  const te = new TermExtract()

  td.when(FakeConfig.prototype.getFrequency(sentences))
    .thenReturn(new Frequency(new MockAnalyser(sentences)))
  te.config = new FakeConfig()

  t.deepEqual(te.calculateFrequency(sentences), expected)
})

test('should return a term frequency', t => {
  const expected = [
    ['トライグラム', 10],
    ['単語トライグラム', 3],
    ['トライグラム統計', 2],
    ['クラストライグラム', 1],
    ['トライグラム抽出', 1],
    ['単語トライグラム統計', 1],
    ['文字トライグラム', 1]
  ]
  const FakeConfig = td.constructor(Config)
  const te = new TermExtract()

  td.when(FakeConfig.prototype.getFrequency(sentences))
    .thenReturn(new TermFrequency(new MockAnalyser(sentences)))
  te.config = new FakeConfig()

  t.deepEqual(te.calculateFrequency(sentences), expected)
})

test('should have calculated LF of frequency and frequency', t => {
  const expected = [
    ['トライグラム', 14.696938456699067],
    ['単語トライグラム', 6.260338320293149],
    ['トライグラム統計', 2.9129506302439405],
    ['クラストライグラム', 2.6321480259049848],
    ['トライグラム抽出', 2.6321480259049848],
    ['文字トライグラム', 2.6321480259049848],
    ['単語トライグラム統計', 2.5697965868506505]
  ]
  const FakeConfig = td.constructor(Config)
  const te = new TermExtract()

  td.when(FakeConfig.prototype.getFrequency(sentences))
    .thenReturn(new Frequency(new MockAnalyser(sentences)))
  td.when(FakeConfig.prototype.getScorer(sentences))
    .thenReturn(new FrequencyScorer(new MockAnalyser(sentences)))
  te.config = new FakeConfig()

  t.deepEqual(te.calculateFLR(sentences), expected)
})

test('should have calculated LF of frequency and term frequency', t => {
  const expected = [
    ['トライグラム', 48.98979485566356],
    ['単語トライグラム', 9.390507480439723],
    ['トライグラム統計', 5.825901260487881],
    ['クラストライグラム', 2.6321480259049848],
    ['トライグラム抽出', 2.6321480259049848],
    ['文字トライグラム', 2.6321480259049848],
    ['単語トライグラム統計', 2.5697965868506505]
  ]
  const FakeConfig = td.constructor(Config)
  const te = new TermExtract()

  td.when(FakeConfig.prototype.getFrequency(sentences))
    .thenReturn(new TermFrequency(new MockAnalyser(sentences)))
  td.when(FakeConfig.prototype.getScorer(sentences))
    .thenReturn(new FrequencyScorer(new MockAnalyser(sentences)))

  te.config = new FakeConfig()
  t.deepEqual(te.calculateFLR(sentences), expected)
})

test('should have calculated type of frequency and frequency', t => {
  const expected = [
    ['トライグラム', 10.392304845413264],
    ['単語トライグラム', 4.426727678801287],
    ['トライグラム統計', 2.2133638394006434],
    ['クラストライグラム', 2.2133638394006434],
    ['トライグラム抽出', 2.2133638394006434],
    ['文字トライグラム', 2.2133638394006434],
    ['単語トライグラム統計', 1.906368585993873]
  ]
  const FakeConfig = td.constructor(Config)
  const te = new TermExtract()

  td.when(FakeConfig.prototype.getFrequency(sentences))
    .thenReturn(new Frequency(new MockAnalyser(sentences)))
  td.when(FakeConfig.prototype.getScorer(sentences))
    .thenReturn(new TypeScorer(new MockAnalyser(sentences)))
  te.config = new FakeConfig()

  t.deepEqual(te.calculateFLR(sentences), expected)
})

test('should have calculated type of frequency and term frequency', t => {
  const expected = [
    ['トライグラム', 34.64101615137754],
    ['単語トライグラム', 6.64009151820193],
    ['トライグラム統計', 4.426727678801287],
    ['クラストライグラム', 2.2133638394006434],
    ['トライグラム抽出', 2.2133638394006434],
    ['文字トライグラム', 2.2133638394006434],
    ['単語トライグラム統計', 1.906368585993873]
  ]
  const FakeConfig = td.constructor(Config)
  const te = new TermExtract()

  td.when(FakeConfig.prototype.getFrequency(sentences))
    .thenReturn(new TermFrequency(new MockAnalyser(sentences)))
  td.when(FakeConfig.prototype.getScorer(sentences))
    .thenReturn(new TypeScorer(new MockAnalyser(sentences)))
  te.config = new FakeConfig()

  t.deepEqual(Array.from(te.calculateFLR(sentences)), expected)
})

test('should have calculated perplexity of frequency and frequency', t => {
  const expected = [
    ['トライグラム', 3.194987500240385],
    ['単語トライグラム', 2.3074562508413488],
    ['クラストライグラム', 1.7224937501201927],
    ['トライグラム抽出', 1.7224937501201927],
    ['文字トライグラム', 1.7224937501201927],
    ['トライグラム統計', 1.6949875002403856],
    ['単語トライグラム統計', 1.5466583334935902]
  ]
  const FakeConfig = td.constructor(Config)
  const te = new TermExtract()

  td.when(FakeConfig.prototype.getFrequency(sentences))
    .thenReturn(new Frequency(new MockAnalyser(sentences)))
  td.when(FakeConfig.prototype.getScorer(sentences))
    .thenReturn(new PerplexityScorer(new MockAnalyser(sentences)))
  te.config = new FakeConfig()

  t.deepEqual(Array.from(te.calculateFLR(sentences)), expected)
})

test('should have calculated perplexity of frequency and term frequency', t => {
  const expected = [
    ['トライグラム', 4.654419118877683],
    ['単語トライグラム', 2.7224937501201922],
    ['トライグラム統計', 2.2799500009615414],
    ['クラストライグラム', 1.7224937501201927],
    ['トライグラム抽出', 1.7224937501201927],
    ['文字トライグラム', 1.7224937501201927],
    ['単語トライグラム統計', 1.5466583334935902]
  ]
  const FakeConfig = td.constructor(Config)
  const te = new TermExtract()

  td.when(FakeConfig.prototype.getFrequency(sentences))
    .thenReturn(new TermFrequency(new MockAnalyser(sentences)))
  td.when(FakeConfig.prototype.getScorer(sentences))
    .thenReturn(new PerplexityScorer(new MockAnalyser(sentences)))
  te.config = new FakeConfig()

  t.deepEqual(Array.from(te.calculateFLR(sentences)), expected)
})
