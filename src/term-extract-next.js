const mecab = require('./mecab')

// Expose function
exports.scoreFrequency = scoreFrequency

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

function scoreTF (option, corpus) {}

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
