'use strict'

import { MAX_CMP_SIZE, COMPOUND_NOUN_SEPARATOR_REGEX } from '../constants'
import AbstractFrequency from './abstract-frequency'

class TermFrequency extends AbstractFrequency {

  constructor(analyser) {
    super(analyser)
  }

  parse() {
    const termFreqData = new Map()
    const cmpNounFreq = this.analyser.extract()

    for (let cmpNoun of cmpNounFreq.keys()) {
      if (cmpNoun.match(/^\s*$/)) continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue

      const nouns = cmpNoun.split(COMPOUND_NOUN_SEPARATOR_REGEX)

      if (! termFreqData.has(nouns.length)) {
        termFreqData.set(nouns.length, [])
      }
      termFreqData.get(nouns.length).push(cmpNoun)
    }
    return termFreqData
  }

  count() {
    const termFreqData = this.parse()
    const maxNumOfSimpleNouns = Math.max.apply(null, [...termFreqData.keys()])
    const nImp = this.analyser.extract()

    for (let i = 2; i <= maxNumOfSimpleNouns; i++) {
      if (! termFreqData.has(i - 1)) continue
      for (let noun1 of termFreqData.get(i - 1)) {
        const nouns1 = noun1.split(COMPOUND_NOUN_SEPARATOR_REGEX)

        for (let j = i; j <= maxNumOfSimpleNouns; j++) {
          if (! termFreqData.has(j)) continue
          for (let noun2 of termFreqData.get(j)) {
            const nouns2 = noun2.split(COMPOUND_NOUN_SEPARATOR_REGEX)

            loop:
            for (let x = 0; x < nouns2.length; x++) {
              if (nouns2[x] !== nouns1[0]) continue
              if (i === 2) {
                nImp.set(noun1, nImp.get(noun1) + nImp.get(noun2))
                continue
              }
              for (let y = 1; y < nouns1.length; y++) {
                if ((x + y) > nouns2.length - 1) continue loop
                if (y > nouns1.length - 1) continue loop
                if (nouns2[x + y] !== nouns1[y]) continue loop
              }
              nImp.set(noun1, nImp.get(noun1) + nImp.get(noun2))
            }
          }
        }
      }
    }
    return nImp
  }
}

export default TermFrequency
