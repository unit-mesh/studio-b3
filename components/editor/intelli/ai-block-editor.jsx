import { EditorContent, EditorProvider, useEditor } from '@tiptap/react'
import React, { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import { EnterIcon } from '@radix-ui/react-icons'

export const AiBlockEditor = ({ content }) => {
  const extensions = [
    StarterKit,
  ]
  const editor = useEditor({
    extensions,
    content: content,
    editorProps: {
      attributes: {
        class: 'prose',
      },
    },
  })

  return (
    <div className={"ai-block-editor-block"}>
      <EditorContent editor={editor} className={"ai-block-editor"}/>
      {editor && <div className={'ai-block-actions'}>
        <button>Go<EnterIcon/></button>
        <button>Cancel <span>esc</span></button>
      </div>}
    </div>
  )
}

