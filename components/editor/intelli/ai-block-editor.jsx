import { EditorContent, Extension, useEditor } from '@tiptap/react'
import React, { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import { EnterIcon } from '@radix-ui/react-icons'

export const AiBlockEditor = ({ content, cancel }) => {
  const ActionBar = Extension.create({
    addCommands: () => ({
      callAi: () => ({ commands }) => {
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
        'Escape': () => {
          console.log("Escape KEYBOARD??")
          this.editor.commands.cancelAi()
          // this.editor.view?.focus()
        },
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
        class: 'prose ai-block-editor-inner',
      },
    },
  })

  useEffect(() => {
    if (editor) {
      setTimeout(() => {
        if (editor) {
          editor.view.focus()
        }
      }, 100)
    }
  }, [editor])

  useEffect(() => {
    const keyDownHandler = event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        editor?.commands?.newlineInCode()
        editor?.view?.focus()
      }
      if (event.key === 'Escape') {
        console.log("sfdsfsf")
        event.preventDefault();
        editor?.commands?.cancelAi()
      }
    };

    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [editor]);

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
