'use strict'

import AbstractAnalyser from '../analysers/abstract-analyser'

class AbstractFrequency {

  constructor(analyser) {
    if (! (analyser instanceof AbstractAnalyser)) {
      throw new TypeError(`must be an instance of AbstractAnalyser`)
    }
    this.analyser = analyser
  }

  count() {
    return this.analyser.extract()
  }

  find(noun) {
    if (typeof noun !== 'string') {
      throw new TypeError(`must be an instance of String`)
    }

    return this.count().get(noun) || 0
  }
}

export default AbstractFrequency
