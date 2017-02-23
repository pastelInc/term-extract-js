'use strict'

import { NounFrequency } from '../src/noun-frequency'

class MockFrequency extends NounFrequency {
  constructor(sentences) {
    super(sentences)
  }

  nounFrequency() {
    const nounFrequency = new Map()

    for (let cmpNoun of this.parseData()) {
      if (nounFrequency.has(cmpNoun)) {
        nounFrequency.set(cmpNoun, nounFrequency.get(cmpNoun) + 1)
        continue
      }
      nounFrequency.set(cmpNoun, 1)
    }
    return nounFrequency
  }

  parseData() {
    return this.sentence.split(`、`)
  }
}

export default MockFrequency
