import test from 'ava'
import MockAnalyser from './mock-analyser'
import Frequency from '../src/frequencies/frequency'
import { sentences } from './sentences'

test.beforeEach(t => {
  t.context.frequency = new Frequency(new MockAnalyser(sentences))
})

test('depends on NounFrequency', t => {
  t.throws(Frequency, TypeError)
})

test('should return zero', t => {
  t.is(t.context.frequency.find(''), 0)
})

test('calculate a frequency of left concatenated simple nouns', t => {
  t.is(t.context.frequency.find('単語 トライグラム'), 2)
})

test('calculate a frequency of right concatenated simple nouns', t => {
  t.is(t.context.frequency.find('トライグラム 統計'), 1)
})
