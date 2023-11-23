import React from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'

import * as Accordion from '@radix-ui/react-accordion'

import MarkdownIt from 'markdown-it'

import { MenuBar } from './menu-bar'
import { MenuBubble } from './intelli/menu/menu-bubble'
import { createSlashExtension } from './intelli/slash-extension'
import { CommandFunctions } from './action/command-functions'
import { createAiBlock } from './intelli/ai-block-extension'
import TrackChangeExtension from './diff/track-change-extension'
import { ChevronDownIcon } from '@radix-ui/react-icons'

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
2. use \`Alt\` + \`/\` or \`Command\` + \`/\` to show custom AI input box.
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

  return (<div className={'container'}>
      <div className={'editor-block'}>
        <div className={'domain-buttons'}>
          <span className={'scene-text'}>Scene: (Todo)</span>
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

      {editor && <Sidebar eidtor={editor}/>}
    </div>
  )
}

const Sidebar = () => {
  return <aside className={'fixed top-0 right-0 z-40 w-128 h-screen'}
                aria-label="Sidebar">
    <div className={'h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'}>
      <Accordion.Root className={'AccordionRoot'} type="multiple" defaultValue={['item-1', 'item-2', 'item-3']}>
        <Accordion.Item className={'AccordionItem'} value="item-1">
          <AccordionTrigger>Grammarly</AccordionTrigger>
          <AccordionContent>
            TODO: use some model to check grammar
          </AccordionContent>
        </Accordion.Item>

        <Accordion.Item className={'AccordionItem'} value="item-2">
          <AccordionTrigger>Text Prediction</AccordionTrigger>
          <AccordionContent>
            TODO: use <a href="https://github.com/unit-mesh/edge-infer">EdgeInference</a> to predict text
          </AccordionContent>
        </Accordion.Item>

        <Accordion.Item className={'AccordionItem'} value="item-3">
          <AccordionTrigger>Similarity</AccordionTrigger>
          <Accordion.Content className={'AccordionContent'}>
            <div className={'AccordionContentText'}>
              TODO: use <a href="https://github.com/unit-mesh/edge-infer">EdgeInference</a> to calculate similarity
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  </aside>
}

const AccordionTrigger = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="AccordionHeader">
    <Accordion.Trigger
      className={'AccordionTrigger'}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon className="AccordionChevron" aria-hidden/>
    </Accordion.Trigger>
  </Accordion.Header>
))

const AccordionContent = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={'AccordionContent'}
    {...props}
    ref={forwardedRef}
  >
    <div className="AccordionContentText">{children}</div>
  </Accordion.Content>
))

export default LiveEditor