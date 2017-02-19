'use strict'

import { NounFrequency, MeCabFrequency } from './noun-frequency'

const MAX_CMP_SIZE = 1024

export class AbstractFrequencyScore {

  constructor(nounFrequency = new MeCabFrequency()) {
    if (! (nounFrequency instanceof NounFrequency)) {
      throw new TypeError(`Must be an instance of NounFrequency`)
    }
    this.nounFrequency = nounFrequency
  }

  cmpNounFrq(sentence) {
    return this.nounFrequency.nounFrequency(sentence)
  }

  frequency(noun, sentence) {
    return this.nounFrequency.nounFrequency(sentence).get(noun) || 0
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

  termFrqData(sentence) {
    const termFrqData = new Map()
    const cmpNounFrq = this.nounFrequency.nounFrequency(sentence)

    for (let cmpNoun of cmpNounFrq.keys()) {
      if (cmpNoun.match(/^\s*$/)) continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue

      const nouns = cmpNoun.split(/\s+/)

      if (! termFrqData.has(nouns.length)) {
        termFrqData.set(nouns.length, [])
      }
      termFrqData.get(nouns.length).push(cmpNoun)
    }
    return termFrqData
  }

  frequency(noun, sentence) {
    const termFrqData = this.termFrqData(sentence)
    const nImp = this.nounFrequency.nounFrequency(sentence)
    const maxNumOfSimpleNouns = Math.max.apply(null, [...termFrqData.keys()])

    for (let i = 2; i <= maxNumOfSimpleNouns; i++) {
      if (! termFrqData.has(i - 1)) continue
      for (let noun1 of termFrqData.get(i - 1)) {
        const nouns1 = noun1.split(/\s+/)

        for (let j = i; j <= maxNumOfSimpleNouns; j++) {
          if (! termFrqData.has(j)) continue
          for (let noun2 of termFrqData.get(j)) {
            const nouns2 = noun2.split(/\s+/)

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
    return nImp.get(noun) || 0
  }
}
