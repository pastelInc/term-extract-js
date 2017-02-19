'use strict'

import { NounFrequency } from '../src/noun-frequency'

class MockFrequency extends NounFrequency {
  constructor() {
    super()
  }

  nounFrequency(sentence = '') {
    const nounFrequency = new Map()

    for (let cmpNoun of sentence.split(`、`)) {
      if (nounFrequency.has(cmpNoun)) {
        nounFrequency.set(cmpNoun, nounFrequency.get(cmpNoun) + 1)
        continue
      }
      nounFrequency.set(cmpNoun, 1)
    }
    return nounFrequency
  }
}

export default MockFrequency
