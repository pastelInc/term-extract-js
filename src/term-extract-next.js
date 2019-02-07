const mecab = require('./mecab')

// Constants
const MAX_CMP_SIZE = 1024
// const COMPOUND_NOUN_SEPARATOR = ' '
const COMPOUND_NOUN_SEPARATOR_REGEX = /\s+/

// Expose function
exports.scoreFrequency = scoreFrequency
exports.scoreTF = scoreTF

const defaultOption = {
  analyser: mecab,
  averageRate: 1,
  ignoreWords: []
}

/**
 * Score frequency.
 * @param option
 * @param corpus
 */
async function scoreFrequency (option, corpus) {
  // const { analyser } = Object.assign(defaultOption, option)
  const { analyser } = mergeDeep(defaultOption, option)
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
 * @param option
 * @param corpus
 */
async function scoreTF (option, corpus) {
  const tfData = new Map()
  const frequency = await scoreFrequency(option, corpus)

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

function scoreLR (option, corpus) {}

function scoreFLR (option, corpus) {}

function scoreTFLR (option, corpus) {}

function scorePerplexity (option, corpus) {}

function scoreTFPP (option, corpus) {}

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
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}
