import { EditorContent, Extension, useEditor } from '@tiptap/react'
import React, { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import { EnterIcon } from '@radix-ui/react-icons'

const ActionBar = Extension.create({
  addCommands: () => ({
    callAi: () => ({ commands }) => {
      console.log('call ai')
      commands.insertContent({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello World!',
          },
        ],
      })
    },
    cancelAi: () => ({ commands }) => {
      console.log('cancel ai')
    },
  }),
})

export const AiBlockEditor = ({ content }) => {
  const extensions = [
    StarterKit,
    ActionBar,
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

  useEffect(() => {
    if (editor) editor.view.focus();
  }, [editor])

  return (
    <div className={'ai-block-editor-block'}>
      <EditorContent editor={editor} className={'ai-block-editor'}/>
      {editor && <div className={'ai-block-actions'}>
        <button onClick={() => {
          editor.commands.callAi()
        }}>
          Go<EnterIcon/>
        </button>
        <button onClick={() => {
          editor.commands.cancelAi()
        }}>Cancel <span>esc</span></button>
      </div>}
    </div>
  )
}
