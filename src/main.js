// LICENSE : MIT
'use strict'

import TermExtract from './term-extract'
import TypeScorer from './scorers/type-scorer'
import FrequencyScorer from './scorers/frequency-scorer'
import PerplexityScorer from './scorers/perplexity-scorer'
import Frequency from './frequencies/frequency'
import TermFrequency from './frequencies/term-frequency'
import MeCab from './analysers/mecab'

exports.orderedByFrequency = (str) => {
  const analyser = new MeCab(str)
  const frequency = new Frequency(analyser)
  const scorer = new TypeScorer(analyser)
  const termExtract = new TermExtract(frequency, scorer)

  return termExtract.calculateFrequency()
}

exports.orderedByTF = (str) => {
  const analyser = new MeCab(str)
  const frequency = new TermFrequency(analyser)
  const scorer = new TypeScorer(analyser)
  const termExtract = new TermExtract(frequency, scorer)

  return termExtract.calculateFrequency()
}

exports.orderedByTypeLRMethodUsingFreq = (str) => {
  const analyser = new MeCab(str)
  const frequency = new Frequency(analyser)
  const scorer = new TypeScorer(analyser)
  const termExtract = new TermExtract(frequency, scorer)

  return termExtract.calculateFLR()
}

exports.orderedByTypeLRMethodUsingTF = (str) => {
  const analyser = new MeCab(str)
  const frequency = new TermFrequency(analyser)
  const scorer = new TypeScorer(analyser)
  const termExtract = new TermExtract(frequency, scorer)

  return termExtract.calculateFLR()
}

exports.orderedByFreqLRMethodUsingFreq = (str) => {
  const analyser = new MeCab(str)
  const frequency = new Frequency(analyser)
  const scorer = new FrequencyScorer(analyser)
  const termExtract = new TermExtract(frequency, scorer)

  return termExtract.calculateFLR()
}

exports.orderedByFreqLRMethodUsingTF = (str) => {
  const analyser = new MeCab(str)
  const frequency = new TermFrequency(analyser)
  const scorer = new FrequencyScorer(analyser)
  const termExtract = new TermExtract(frequency, scorer)

  return termExtract.calculateFLR()
}

exports.orderedByPerplexityUsingFreq = (str) => {
  const analyser = new MeCab(str)
  const frequency = new Frequency(analyser)
  const scorer = new PerplexityScorer(analyser)
  const termExtract = new TermExtract(frequency, scorer)

  return termExtract.calculateFLR(frequency, scorer)
}

exports.orderedByPerplexityLRMethodUsingTF = (str) => {
  const analyser = new MeCab(str)
  const frequency = new TermFrequency(analyser)
  const scorer = new PerplexityScorer(analyser)
  const termExtract = new TermExtract(frequency, scorer)

  return termExtract.calculateFLR()
}
