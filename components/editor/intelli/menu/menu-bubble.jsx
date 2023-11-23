import { BubbleMenu } from '@tiptap/react'
import React from 'react'
import { MagicWandIcon } from '@radix-ui/react-icons'
import { Span, Change, ChangeSet } from 'prosemirror-changeset'

const { computeDiff } = ChangeSet

export const MenuBubble = ({ editor }) => {
  const selection = editor.commands.getSelectedText()
  let selectLength = selection?.length ? selection.length : 0

  // 根据长度优化
  return <BubbleMenu className={'ToggleGroup'} editor={editor} tippyOptions={{ duration: 100 }}>
    <div className={'BubbleMenuGroup'}>
      {editor.isActive('heading', { level: 1 }) && <button
        value="left" aria-label="Left aligned"
        className={editor.isActive('bold') ? 'is-active BubbleMenuItem' : 'BubbleMenuItem'}
      >优化标题</button>
      }
      {selectLength < 64 && <button
        value="left" aria-label="Left aligned"
        className={editor.isActive('bold') ? 'is-active BubbleMenuItem' : 'BubbleMenuItem'}
      >扩写</button>
      }
      {selectLength > 64 && <>
        <button
          onClick={() => {
            editor.commands.setTrackChangeStatus(true)

            const selection = editor.state.selection
            editor.chain().focus().insertContentAt({
              from: selection.from,
              to: selection.to
            }, '永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右').run()

            let content1 = '永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右'
            let content2 = '岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右'
            let diff = []
            let output = computeDiff(content1, content2, diff)
            console.log(output)

            editor.commands.setTrackChangeStatus(false)
          }}
          value="left" aria-label="Left aligned"
          className={editor.isActive('bold') ? 'is-active BubbleMenuItem' : 'BubbleMenuItem'}
        >
          <MagicWandIcon/> 优化表达
        </button>
        <button
          value="right" aria-label="Left aligned"
          className={editor.isActive('bold') ? 'is-active BubbleMenuItem' : 'BubbleMenuItem'}
        >
          精炼内容
        </button>
      </>
      }
    </div>
  </BubbleMenu>
}