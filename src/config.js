import TypeScorer from './scorers/type-scorer'
import FrequencyScorer from './scorers/frequency-scorer'
import PerplexityScorer from './scorers/perplexity-scorer'
import Frequency from './frequencies/frequency'
import TermFrequency from './frequencies/term-frequency'
import MeCab from './analysers/mecab'

class Config {

  constructor(config = {}) {
    this.config = Object.assign({
      frequency: 'frequency',
      scorer: 'frequency'
    }, config)
  }

  /**
   * @return AbstractFrequency
   */
  getFrequency(str) {
    if (this.config.frequency === 'term-frequency') {
      return new TermFrequency(new MeCab(str))
    }
    return new Frequency(new MeCab(str))
  }

  /**
   * @return AbstractScorer
   */
  getScorer(str) {
    if (this.config.scorer === 'type') {
      return new TypeScorer(new MeCab(str))
    }
    if (this.config.scorer === 'perplexity') {
      return new PerplexityScorer(new MeCab(str))
    }
    return new FrequencyScorer(new MeCab(str))
  }
}

export default Config