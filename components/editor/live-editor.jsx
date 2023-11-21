import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { MenuBar } from './menu-bar'

import MarkdownIt from 'markdown-it'
import { MenuBubble } from './intelli/menu/menu-bubble'
import { createSlashExtension } from './intelli/slash-extension'
import { CommandFunctions } from './action/command-functions'
import { createQuickExtension } from './intelli/quick-extension'

const md = new MarkdownIt()

const extensions = [
  CommandFunctions,
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
  createSlashExtension('ai-slash', {
    items: [
      {
        title: '续写',
        command: 'continue',
      },
      {
        title: '总结',
        command: 'summarize',
      }
    ]
  }),
  createQuickExtension(),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // @ts-ignore
  TextStyle.configure({ types: [ListItem.name] }),
]

const content = `
## bb editor

Hi there, BB is editor for Unit Mesh architecture paradigms, the next-gen software architecture.

1. use \`/\` to trigger AI commands.
2. use \`Alt\` + \`/\` or \`Option\` + \`/\` to show custom input box.
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
    <div>
      {editor && <MenuBar editor={editor}/>}
      <EditorContent editor={editor}/>
      {editor && <MenuBubble editor={editor}/>}
    </div>
  )
}

export default LiveEditor