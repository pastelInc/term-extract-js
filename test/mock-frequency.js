'use strict'

import { NounFrequency } from '../src/noun-frequency'

class MockFrequency extends NounFrequency {

  constructor(sentences) {
    super(sentences)
  }

  parseData() {
    for (let cmpNoun of this.parseTestData()) {
      if (this.cmpNounFrq.has(cmpNoun)) {
        this.cmpNounFrq.set(cmpNoun, this.cmpNounFrq.get(cmpNoun) + 1)
        continue
      }
      this.cmpNounFrq.set(cmpNoun, 1)
    }
  }

  parseTestData() {
    return this.sentence.split(`、`)
  }
}

export default MockFrequency
