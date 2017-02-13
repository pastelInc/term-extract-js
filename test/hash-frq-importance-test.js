import test from 'ava'
import { HashFrqImportance } from '../src/importance'

test.beforeEach(t => {
  t.context.imp = new HashFrqImportance()
})

test('calicurate importance of word by temporary hash on frequency', t => {
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
    ['765プロダクション', 1]
  ]

  t.deepEqual(Array.from(t.context.imp.nounImportance(sentences)), expected)
})
