const mecab = require('./mecab')

// Constants
const MAX_CMP_SIZE = 1024
const COMPOUND_NOUN_SEPARATOR_REGEX = /\s+/

// Expose function
exports.scoreFrequency = scoreFrequency
exports.scoreTF = scoreTF
exports.scoreLR = scoreLR
exports.scoreFLR = scoreFLR
exports.scoreTFLR = scoreTFLR

const defaultLROptions = {
  analyser: mecab,
  averageRate: 1,
  ignoreWords: [],
  takeUnique: false
}

/**
 * Score frequency.
 * @param corpus
 * @param analyser
 */
async function scoreFrequency (corpus, analyser = mecab) {
  const frequency = new Map()
  const nounList = await analyser(corpus)

  nounList.forEach(element => {
    if (frequency.has(element)) {
      frequency.set(element, frequency.get(element) + 1)
    } else {
      frequency.set(element, 1)
    }
  })
  return frequency
}

/**
 * Score term frequency.
 * @param corpus
 * @param analyser
 */
async function scoreTF (corpus, analyser = mecab) {
  const tfData = new Map()
  const frequency = await scoreFrequency(corpus, analyser)

  // Step1: Making data
  for (let cmpNoun of frequency.keys()) {
    if (cmpNoun.match(/^\s*$/)) {
      continue
    }
    if (cmpNoun.length > MAX_CMP_SIZE) {
      continue
    }

    const nouns = cmpNoun.split(COMPOUND_NOUN_SEPARATOR_REGEX)

    if (!tfData.has(nouns.length)) {
      tfData.set(nouns.length, [])
    }
    tfData.get(nouns.length).push(cmpNoun)
  }

  // Step2: Calculate
  const source = new Map([...tfData.entries()].sort())
  const target = new Map([...source.entries()])
  const maxOfLength = Math.max.apply(null, [...tfData.keys()])
  source.delete(maxOfLength)
  target.delete(0)
  for (let [srcLen, srcCompNouns] of source) {
    for (let [targetLen, targetCompNouns] of target) {
      if (srcLen >= targetLen) continue
      for (let srcCompNoun of srcCompNouns) {
        for (let targetCompNoun of targetCompNouns) {
          if (!targetCompNoun.includes(srcCompNoun)) continue
          frequency.set(srcCompNoun, frequency.get(srcCompNoun) + frequency.get(targetCompNoun))
        }
      }
    }
  }
  return frequency
}

function collectStatistics (frequency, ignoreWords, takeUnique) {
  const stat = new Map()
  const comb = new Map()

  for (let cmpNoun of frequency.keys()) {
    if (cmpNoun === '') continue
    if (cmpNoun.length > MAX_CMP_SIZE) continue

    const nouns = cmpNoun.split(COMPOUND_NOUN_SEPARATOR_REGEX).filter((noun) => {
      return !(ignoreWords.includes(noun)) && !(noun.match(/^[\d\.\,]+$/))
    })

    if (!(nouns.length > 1)) continue

    for (let noun of nouns) {
      if (stat.has(noun)) continue
      stat.set(noun, [0, 0])
    }

    if (!takeUnique) {
      for (let i = 0; i < nouns.length - 1; i++) {
        stat.get(nouns[i])[0] += frequency.get(cmpNoun)
        stat.get(nouns[i + 1])[1] += frequency.get(cmpNoun)
      }
      continue
    }
    for (let i = 0; i < nouns.length - 1; i++) {
      const combKey = `${nouns[i]} ${nouns[i + 1]}`

      if (comb.has(combKey)) {
        comb.set(combKey, comb.get(combKey) + frequency.get(cmpNoun))
        continue
      }
      comb.set(combKey, frequency.get(cmpNoun))
      stat.get(nouns[i])[0] += 1
      stat.get(nouns[i + 1])[1] += 1
    }
  }

  return stat
}

async function scoreLR (corpus, options = {}) {
  if (typeof corpus !== 'string') {
    throw new TypeError(`must be an instance of String`)
  }

  // const { analyser } = Object.assign(defaultLROptions, options)
  const { analyser, averageRate, ignoreWords, takeUnique } = mergeDeep(defaultLROptions, options)
  const frequency = await scoreFrequency(corpus, analyser)
  const stat = collectStatistics(frequency, ignoreWords, takeUnique)
  const nounImportance = new Map()

  for (let cmpNoun of frequency.keys()) {
    let count = 0
    let importance = 1

    for (let n of cmpNoun.split(COMPOUND_NOUN_SEPARATOR_REGEX)) {
      if (ignoreWords.includes(n)) continue
      if (n.match(/^[\d\.\,]+$/)) continue

      const pre = (stat.has(n)) ? stat.get(n)[0] : 0
      const post = (stat.has(n)) ? stat.get(n)[1] : 0

      count++
      importance *= (pre + 1) * (post + 1)
    }

    if (count === 0) count = 1

    importance = Math.pow(importance, (1 / (2 * averageRate * count)))
    nounImportance.set(cmpNoun, importance)
  }

  return nounImportance
}

async function scoreFLR (corpus, options = {}) {
  if (typeof corpus !== 'string') {
    throw new TypeError(`must be an instance of String`)
  }

  // const { analyser } = Object.assign(defaultLROptions, options)
  const { analyser } = mergeDeep(defaultLROptions, options)
  const frequency = await scoreFrequency(corpus, analyser)
  const lr = await scoreLR(corpus, options)
  const nounImportance = new Map()

  for (let [cmpNoun, importance] of frequency) {
    nounImportance.set(cmpNoun, importance * lr.get(cmpNoun))
  }

  return nounImportance
}

async function scoreTFLR (corpus, options = {}) {
  if (typeof corpus !== 'string') {
    throw new TypeError(`must be an instance of String`)
  }

  // const { analyser } = Object.assign(defaultLROptions, options)
  const { analyser } = mergeDeep(defaultLROptions, options)
  const frequency = await scoreTF(corpus, analyser)
  const lr = await scoreLR(corpus, options)
  const nounImportance = new Map()

  for (let [cmpNoun, importance] of frequency) {
    nounImportance.set(cmpNoun, importance * lr.get(cmpNoun))
  }

  return nounImportance
}

function scorePerplexity (corpus, options = {}) {}

function scoreTFPP (corpus, options = {}) {}

/**
 * Simple object check.
 * @param item
 * @returns boolean
 */
function isObject (item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep (target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) target = Object.assign({}, target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        target = Object.assign({}, target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}
