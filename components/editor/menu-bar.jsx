import { useCurrentEditor } from '@tiptap/react'
import {
  ActivityLogIcon,
  CodeIcon, CookieIcon, Cross2Icon,
  DividerHorizontalIcon,
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
  MixerHorizontalIcon,
  QuoteIcon,
  StrikethroughIcon, TextIcon
} from '@radix-ui/react-icons'
import React from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import * as Popover from '@radix-ui/react-popover'

export const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) return null

  return (
    <ToggleGroup.Root
      className={'ToggleGroup'}
      type="single"
      defaultValue="center"
      aria-label="Text alignment"
    >
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="left" aria-label="Left aligned"
      >
        <FontBoldIcon/>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        <FontItalicIcon/>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        <StrikethroughIcon/>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        <CodeIcon/>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        <TextIcon/>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        H1
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        H2
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        H3
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        H4
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        <ListBulletIcon/>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        <ActivityLogIcon/>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        <CodeIcon/>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active ToggleGroupItem' : 'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        <QuoteIcon/>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={'ToggleGroupItem'}
        value="center" aria-label="Center aligned"
      >
        <DividerHorizontalIcon/>
      </ToggleGroup.Item>

      {/*// spike: https://ai-demo.tiptap.dev/kmLmpqbFJW*/}
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className={'ToggleGroupItem flex items-center justify-center relative'} value="center"
                  aria-label="Center aligned" aria-label="Update dimensions">
            <div className={'absolute top-0 right-0 transform -translate-x-1 -translate-y-0.5'}>
              <div className={'absolute px-1 text-[0.75rem] bg-pink-500 text-white rounded-md font-semibold'}>AI</div>
            </div>
            <CookieIcon/>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="PopoverContent" sideOffset={5}>
            <button>
              <div className={"text-gray-500"}>Spelling & Grammar</div>
            </button>
            {/*<Popover.Close className="PopoverClose" aria-label="Close">*/}
            {/*  <Cross2Icon/>*/}
            {/*</Popover.Close>*/}
            {/*<Popover.Arrow className="PopoverArrow"/>*/}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </ToggleGroup.Root>
  )
}