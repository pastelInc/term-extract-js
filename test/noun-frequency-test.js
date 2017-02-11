import test from 'ava'
import MeCabFrequency from '../src/noun-frequency'

test.beforeEach(t => {
  t.context.meCab = new MeCabFrequency()
})

test('parse sentence is successful', t => {
  t.deepEqual(t.context.meCab.parse('アイドルマスター'), [
    ['アイドルマスター', '名詞', '固有名詞', '一般', '*', '*', '*', 'THE IDOLM@STER', 'アイドルマスター', 'アイドルマスター']
  ])
})

test('single noun should be true', t => {
  t.true(t.context.meCab.isSingleNoun('アイドルマスター', '名詞', '固有名詞', '一般'))
})

test('should find noun frequency', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['水瀬伊織', 1],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1],
    ['765プロダクション 所属 アイドル 候補生', 1]
  ]
  const nounFrequency = [...t.context.meCab.nounFrequency(sentence)]

  t.deepEqual(nounFrequency, expected)
})
