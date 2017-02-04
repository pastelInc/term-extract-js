import { CalcImpotance } from './impotance'

class TermExtract {

  constructor(calcImp) {
    if (! (calcImp instanceof CalcImpotance)) {
      throw new TypeError(`Must be an instance of CalcImpotance`)
    }
    this.calcImp = calcImp
  }

  /**
   * Calicurate LR of word.
   * @return Object
   */
  getImpWord(terms = '') {
    if (terms === '') {
      return []
    }
    return this.calcImp.impotance(terms)
  }
}

export default TermExtract
