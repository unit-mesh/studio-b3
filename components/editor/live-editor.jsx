import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { MenuBar } from './menu-bar'

import MarkdownIt from 'markdown-it'
import { AiBubbleMenu } from './ai-bubble-menu'
import { CommandsList, SlashCommands } from './slash-commands'

const md = new MarkdownIt()
const CustomCommands = Extension.create({
  addCommands: () => {
    return {
      getSelectedText: () => ({ editor }) => {
        const { from, to, empty } = editor.state.selection

        if (empty) {
          return null
        }

        return editor.state.doc.textBetween(from, to, ' ')
      },
    }
  },
})

const extensions = [
  CustomCommands,
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
  SlashCommands.configure({
    commands: [
      { title: "续写内容", options: { command: "continue-writing" } }
    ],
    component: CommandsList
  }),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // @ts-ignore
  TextStyle.configure({ types: [ListItem.name] }),
]

const content = `
## bb editor

Hi there, BB is editor for Unit Mesh architecture paradigms, the next-gen software architecture.

1. use \`/\` to trigger AI commands.
2. use \`Alt\` + \`Enter\` to trigger the code gen.
3. select text and right click to see the context menu.

`

const LiveEditor = () => {
  const editor = useEditor({
    extensions,
    content: md.render(content),
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base bb-editor-inner',
      },
    },
  })

  return (
    <>
      { editor && <MenuBar editor={editor}/> }
      <EditorContent editor={editor}/>
      { editor && <AiBubbleMenu editor={editor}/> }
    </>
  )
}

export default LiveEditor