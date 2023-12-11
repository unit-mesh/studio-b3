// @ts-nocheck
// TODO: Fix this

import {
	ActivityLogIcon,
	CodeIcon,
	DividerHorizontalIcon,
	FontBoldIcon,
	FontItalicIcon,
	ListBulletIcon,
	QuoteIcon,
	StrikethroughIcon,
	TextIcon
} from '@radix-ui/react-icons'
import React from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Editor } from "@tiptap/core";

import { ToolbarAiDropdown } from '@/editor/menu/toolbar-ai-dropdown'

export interface ToolbarProps {
	editor: Editor
	isBubbleMenu?: boolean // 是否是气泡菜单
	className?: string
}

export const ToolbarMenu = ({ editor, isBubbleMenu = false, className }: ToolbarProps) => {
	return (
		<ToggleGroup.Root
			className={`${className} toggle-group`}
			type="single"
			defaultValue="center"
			aria-label="Text alignment"
		>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				className={editor.isActive('bold') ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="left" aria-label="Left aligned"
			>
				<FontBoldIcon/>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				className={editor.isActive('italic') ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				<FontItalicIcon/>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleStrike().run()}
				disabled={!editor.can().chain().focus().toggleStrike().run()}
				className={editor.isActive('strike') ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				<StrikethroughIcon/>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleCode().run()}
				disabled={!editor.can().chain().focus().toggleCode().run()}
				className={editor.isActive('code') ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				<CodeIcon/>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().setParagraph().run()}
				className={editor.isActive('paragraph') ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				<TextIcon/>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				className={editor.isActive('heading', { level: 1 }) ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				H1
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className={editor.isActive('heading', { level: 2 }) ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				H2
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				className={editor.isActive('heading', { level: 3 }) ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				H3
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				className={editor.isActive('heading', { level: 4 }) ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				H4
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive('bulletList') ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				<ListBulletIcon/>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive('orderedList') ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				<ActivityLogIcon/>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={editor.isActive('codeBlock') ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				<CodeIcon/>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={editor.isActive('blockquote') ? 'is-active toggle-group-item' : 'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				<QuoteIcon/>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				onClick={() => editor.chain().focus().setHorizontalRule().run()}
				className={'toggle-group-item'}
				value="center" aria-label="Center aligned"
			>
				<DividerHorizontalIcon/>
			</ToggleGroup.Item>

      { !isBubbleMenu && <>
        <div className="empty-separator" />
        <ToolbarAiDropdown editor={editor}/>
      </> }
		</ToggleGroup.Root>
	)
}