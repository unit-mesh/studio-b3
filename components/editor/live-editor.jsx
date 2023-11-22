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
import { createAiBlock } from './intelli/ai-block'

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
  createAiBlock(),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // @ts-ignore
  TextStyle.configure({ types: [ListItem.name] }),
]

const content = `
## bb editor

Hi there, BB is editor for Unit Mesh architecture paradigms, the next-gen software architecture.

1. use \`/\` to trigger AI commands.
2. use \`Alt\` + \`/\` or \`Command\` + \`/\` to show custom input box.
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
      <div className={'domain-buttons'}>
        <button disabled={true} className={'domain-button'}>Blog</button>
        <button disabled={true} className={'domain-button'}>Weekly Report</button>
        <button disabled={true} className={'domain-button'}>Meeting Notes</button>
        <button disabled={true} className={'domain-button'}>User Story</button>
      </div>
      <div className={'editor-section'}>
        {editor && <MenuBar editor={editor}/>}
        <EditorContent editor={editor}/>
        {editor && <MenuBubble editor={editor}/>}
      </div>
    </div>
  )
}

export default LiveEditor