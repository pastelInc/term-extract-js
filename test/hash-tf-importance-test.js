import test from 'ava'
import { HashTFImportance } from '../src/importance'

test.beforeEach(t => {
  t.context.imp = new HashTFImportance()
})

test('return single-noun number data in compound word', t => {
  const sentences = `水瀬伊織（みなせ いおり）は、ゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。自分自身の力で掴み取る栄光を求めて765プロダクションに入る。`
  const expected = [
    [1,['水瀬伊織','ゲーム','アイドルマスター','の登場人物','自分自身','力','栄光','765プロダクション']],
    [4,['765プロダクション 所属 アイドル 候補生']]
  ]

  t.deepEqual(Array.from(t.context.imp.termFrqData(sentences)), expected)
})

test('calicurate importance of word by temporary hash on term frequency', t => {
  const sentences = `水瀬伊織（みなせ いおり）は、ゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。自分自身の力で掴み取る栄光を求めて765プロダクションに入る。`
  const expected = [
    ['水瀬伊織', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1],
    ['765プロダクション 所属 アイドル 候補生', 1],
    ['自分自身', 1],
    ['力', 1],
    ['栄光', 1],
    ['765プロダクション', 2]
  ]

  t.deepEqual(Array.from(t.context.imp.nounTermFrequency(sentences)), expected)
})
