import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, Extension, FloatingMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { MenuBar } from './menu-bar'

import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

const AiPlugin = Extension.create({
  // @ts-ignore
  addKeyboardShortcuts () {
    return {
      '/': (props) => {
        const editor = props.editor
        //
        if (editor.isActive('paragraph')) {
          console.log('paragraph')
        }
        // editor.isActive('heading', {level: 3})
        if (editor.isActive('heading')) {
          console.log('heading')
        }
      }
    }
  }
})

const extensions = [
  AiPlugin,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // @ts-ignore
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

const content = `
## 2b editor

Hi there, 2B is editor for Unit Mesh architecture paradigms, the next-gen software architecture.

1. use \`/\` to trigger AI commands.
2. use \`Alt\` + \`Enter\` to trigger the code gen.
3. select text and right click to see the context menu.

`

const LiveEditor = () => {
  return (
    <>
      <EditorProvider
        extensions={extensions}
        content={md.render(content)}
        editorProps={{
          attributes: {
            class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
          },
        }}
        slotBefore={<MenuBar/>}
      >

      </EditorProvider>
    </>
  )
}

export default LiveEditor
