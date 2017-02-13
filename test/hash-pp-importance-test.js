import test from 'ava'
import { HashPerplexityImportance } from '../src/importance'

test.beforeEach(t => {
  t.context.imp = new HashPerplexityImportance()
})

test('calculete morpheme-specific statistics for perplexity', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['765プロダクション', 0.34657359027997264],
    ['所属', 0.6931471805599453],
    ['アイドル',0.6931471805599453],
    ['候補生', 0.34657359027997264]
  ]

  t.deepEqual(Array.from(t.context.imp.statistics(sentence)), expected)
})

test('calicurate importance of word by temporary hash on perplexity', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['水瀬伊織', 1],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1],
    ['765プロダクション 所属 アイドル 候補生', 1.375]
  ]

  t.deepEqual(Array.from(t.context.imp.nounImportance(sentence)), expected)
})
