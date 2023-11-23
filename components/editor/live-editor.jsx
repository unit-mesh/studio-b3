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
import { createAiBlock } from './intelli/ai-block-extension'
import TrackChangeExtension from './diff/track-change-extension'

const md = new MarkdownIt()

const extensions = [
  CommandFunctions,
  TrackChangeExtension.configure({
    enabled: false,
  }),
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
        title: 'AI 续写',
        command: 'continue',
      },
      {
        title: 'AI 总结',
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
# 3B editor

Hi there, 3B is editor for Unit Mesh architecture paradigms, the next-gen software architecture.

1. use \`/\` to trigger AI commands.
2. use \`Alt\` + \`/\` or \`Command\` + \`/\` to show custom input box.
3. select text and right click to see the context menu.

## Inline AI

Chinese text for testing grammar and spellings, select long text to see the menu.

永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右，引以为流觞曲水，
列坐其次。虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。

是日也，天朗气清，惠风和畅。仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。

夫人之相与，俯仰一世，或取诸怀抱，悟言一室之内；或因寄所托，放浪形骸之外。虽趣舍万殊，静躁不同，当其欣于所遇，暂得于己，快然自足，不知老之将至。
及其所之既倦，情随事迁，感慨系之矣。向之所欣，俯仰之间，已为陈迹，犹不能不以之兴怀。况修短随化，终期于尽。古人云：“死生亦大矣。”岂不痛哉！

每览昔人兴感之由，若合一契，未尝不临文嗟悼，不能喻之于怀。固知一死生为虚诞，齐彭殇为妄作。后之视今，亦犹今之视昔。悲夫！故列叙时人，录其所述，
虽世殊事异，所以兴怀，其致一也。后之览者，亦将有感于斯文。

`
const LiveEditor = () => {
  const editor = useEditor({
    extensions,
    content: md.render(content),
    editorProps: {
      attributes: {
        class: 'prose lg:prose-xl bb-editor-inner',
      },
    },
  })

  return (
    <div>
      <div className={'domain-buttons'}>
        <span className={"scene-text"}>Scene: (Todo)</span>
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