import { BubbleMenu } from '@tiptap/react'
import React from 'react'
import { MagicWandIcon } from '@radix-ui/react-icons'

export const MenuBubble = ({ editor }) => {
  const selection = editor.commands.getSelectedText()
  let selectLength = selection?.length ? selection.length : 0

  // 根据长度优化
  return <BubbleMenu className={'ToggleGroup'} editor={editor} tippyOptions={{ duration: 100 }}>
    {selectLength > 20 && <button
      onClick={() => editor.chain().focus().toggleBold().run()}
      value="left" aria-label="Left aligned"
      className={editor.isActive('bold') ? 'is-active BubbleMenuItem' : 'BubbleMenuItem'}
    >
      <MagicWandIcon /> 优化表达
    </button>
    }
  </BubbleMenu>
}