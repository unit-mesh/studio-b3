import { EditorContent, Extension, useEditor } from '@tiptap/react'
import React, { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import { EnterIcon } from '@radix-ui/react-icons'

export const AiBlockEditor = ({ content, cancel }) => {
  const ActionBar = Extension.create({
    addCommands: () => ({
      callAi: () => ({ commands }) => {
        console.log('call ai')
        commands.insertContent('Hello World!')
      },
      cancelAi: () => ({ commands }) => {
        cancel()
      },
    }),
    addKeyboardShortcuts() {
      return {
        'Mod-Enter': () => {
          this.editor.commands.callAi()
          this.editor.view?.focus()
        },
        Escape: () => this.editor.commands.cancelAi(),
      }
    },
  })

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
    if (editor) editor.view.focus()
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
