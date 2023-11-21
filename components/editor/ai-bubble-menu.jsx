import { BubbleMenu } from '@tiptap/react'
import React from 'react'

export const AiBubbleMenu = ({ editor }) => {
  const selection = editor.commands.getSelectedText()
  let selectLength = selection?.length ? selection.length : 0

  // 根据长度优化
  return <BubbleMenu className={'ToggleGroup'} editor={editor} tippyOptions={{ duration: 100 }}>
    {selectLength > 20 && <button
      onClick={() => editor.chain().focus().toggleBold().run()}
      value="left" aria-label="Left aligned"
      className={editor.isActive('bold') ? 'is-active BubbleMenuItem' : 'BubbleMenuItem'}
    >
      优化表达
    </button>
    }
  </BubbleMenu>
}