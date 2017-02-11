import test from 'ava'
import { HashImpotance, HashFreqImpotance, HashPerplexityImpotance, HashTFImpotance } from '../src/impotance'

test.beforeEach(t => {
  t.context.imp = new HashImpotance()
  t.context.freqImp = new HashFreqImpotance()
  t.context.ppImp = new HashPerplexityImpotance()
  t.context.termFrqImp = new HashTFImpotance()
})

test('should statistically know how much each single noun is associated with other simple nouns', t => {
  const sentence = `765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['765プロダクション', [1, 0]],
    ['所属', [1, 1]],
    ['アイドル', [1, 1]],
    ['候補生', [0, 1]]
  ]

  t.deepEqual(Array.from(t.context.imp.contiguousStatistics(sentence)), expected)
})

test('should be returned keywords that have be sorted by nouns impotance', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    '765プロダクション所属アイドル候補生',
    '水瀬伊織',
    'バンダイナムコゲームス',
    'ゲーム',
    'アイドルマスター',
    'の登場人物'
  ]

  t.deepEqual(Array.from(t.context.imp.impotance(sentence).keys()), expected)
})

test('should be sorted by nouns impotance desc', t => {
  const nImp = new Map([
    ['水瀬伊織', 1.2],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1.8],
    ['の登場人物', 1],
    ['765プロダクション 所属 アイドル 候補生', 1.7]
  ])
  const expected = [
    'アイドルマスター',
    '765プロダクション所属アイドル候補生',
    '水瀬伊織',
    'バンダイナムコゲームス',
    'ゲーム',
    'の登場人物'
  ]

  t.deepEqual(Array.from(t.context.imp.nounsImpDesc(nImp).keys()), expected)
})

test('should be calculated nouns impotance by term frequency', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['水瀬伊織', 1],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1],
    ['765プロダクション所属アイドル候補生', 1]
  ]

  t.deepEqual(Array.from(t.context.termFrqImp.impotance(sentence)), expected)
})

test('return term frequency', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    [1, ['水瀬伊織','バンダイナムコゲームス','ゲーム','アイドルマスター','の登場人物']],
    [4, ['765プロダクション 所属 アイドル 候補生']]
  ]

  t.deepEqual(Array.from(t.context.termFrqImp.termFrequency(sentence)), expected)
})
