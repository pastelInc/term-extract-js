'use strict'

import { NounFrequency } from './noun-frequency'
import { MAX_CMP_SIZE, COMPOUND_NOUN_SEPARATOR_REGEX } from './constants'

export class AbstractFrequencyScore {

  constructor(nounFrequency) {
    if (! (nounFrequency instanceof NounFrequency)) {
      throw new TypeError(`Must be an instance of NounFrequency`)
    }
    this.nounFrequency = nounFrequency
  }

  cmpNounFrq() {
    return this.nounFrequency.nounFrequency()
  }

  cmpNouns() {
    return this.cmpNounFrq()
  }

  frequency(noun) {
    if (typeof noun !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    return this.cmpNounFrq().get(noun) || 0
  }
}

export class FrequencyScore extends AbstractFrequencyScore {

  constructor(nounFrequency) {
    super(nounFrequency)
  }
}

export class TermFrequencyScore extends AbstractFrequencyScore {

  constructor(nounFrequency) {
    super(nounFrequency)
  }

  termFrqData() {
    const termFrqData = new Map()
    const cmpNounFrq = this.nounFrequency.nounFrequency()

    for (let cmpNoun of cmpNounFrq.keys()) {
      if (cmpNoun.match(/^\s*$/)) continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue

      const nouns = cmpNoun.split(COMPOUND_NOUN_SEPARATOR_REGEX)

      if (! termFrqData.has(nouns.length)) {
        termFrqData.set(nouns.length, [])
      }
      termFrqData.get(nouns.length).push(cmpNoun)
    }
    return termFrqData
  }

  cmpNounFrq() {
    const termFrqData = this.termFrqData()
    const maxNumOfSimpleNouns = Math.max.apply(null, [...termFrqData.keys()])
    const nImp = this.nounFrequency.nounFrequency()

    for (let i = 2; i <= maxNumOfSimpleNouns; i++) {
      if (! termFrqData.has(i - 1)) continue
      for (let noun1 of termFrqData.get(i - 1)) {
        const nouns1 = noun1.split(COMPOUND_NOUN_SEPARATOR_REGEX)

        for (let j = i; j <= maxNumOfSimpleNouns; j++) {
          if (! termFrqData.has(j)) continue
          for (let noun2 of termFrqData.get(j)) {
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
