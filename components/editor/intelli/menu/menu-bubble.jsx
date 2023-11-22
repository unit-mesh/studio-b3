import { BubbleMenu } from '@tiptap/react'
import React from 'react'
import { MagicWandIcon } from '@radix-ui/react-icons'

export const MenuBubble = ({ editor }) => {
  const selection = editor.commands.getSelectedText()
  let selectLength = selection?.length ? selection.length : 0

  // 根据长度优化
  return <BubbleMenu className={'ToggleGroup'} editor={editor} tippyOptions={{ duration: 100 }}>
    {selectLength > 20 && <button
      onClick={() => {
        editor.commands.setTrackChangeStatus(true)

        const selection = editor.state.selection
        editor.chain().focus().insertContentAt({
          from: selection.from,
          to: selection.to
        }, '永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右').run()

        editor.commands.setTrackChangeStatus(false)
      }}
      value="left" aria-label="Left aligned"
      className={editor.isActive('bold') ? 'is-active BubbleMenuItem' : 'BubbleMenuItem'}
    >
      <MagicWandIcon/> 优化表达
    </button>
    }
  </BubbleMenu>
}