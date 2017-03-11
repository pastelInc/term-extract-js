'use strict'

import AbstractAnalyser from '../src/analysers/abstract-analyser'

class MockAnalyser extends AbstractAnalyser {

  constructor(sentences) {
    super(sentences)
  }

  parseData() {
    for (let cmpNoun of this.parseTestData()) {
      if (this.cmpNounFreq.has(cmpNoun)) {
        this.cmpNounFreq.set(cmpNoun, this.cmpNounFreq.get(cmpNoun) + 1)
        continue
      }
      this.cmpNounFreq.set(cmpNoun, 1)
    }
  }

  parseTestData() {
    return this.sentence.split(`、`)
  }
}

export default MockAnalyser
