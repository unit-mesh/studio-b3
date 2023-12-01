import React, { useEffect } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'

import { CharacterCount } from "@tiptap/extension-character-count";
import { createInlineCompletion } from "@/components/editor/inline/inline-completion";
import { useTranslation } from "react-i18next";

import MarkdownIt from 'markdown-it'
import { useDebounce } from 'use-debounce';

import { MenuBar } from './menu-bar'
import { MenuBubble } from './intelli/menu/menu-bubble'
import { createSlashExtension } from './intelli/slash-extension'
import { CommandFunctions } from './action/command-functions'
import { createAiBlock } from './intelli/ai-block-extension'
import TrackChangeExtension from './diff/track-change-extension'
import { AdviceExtension } from "./intelli/advice-extension";
import { Sidebar } from './sidebar'

import "./editor.css"

const md = new MarkdownIt()

const extensions = [
	// we define all commands here
	CommandFunctions,
	AdviceExtension,
	TrackChangeExtension.configure({
		enabled: false,
	}),
	createInlineCompletion(),
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
	createSlashExtension('ai-slash'),
	createAiBlock(),
	CharacterCount.configure({}),
	Color.configure({ types: [TextStyle.name, ListItem.name] }),
	// @ts-ignore
	TextStyle.configure({ types: [ListItem.name] }),
]

const LiveEditor = () => {
	const { t, i18n } = useTranslation();

	const editor = useEditor({
		extensions,
		content: md.render(t('Editor Placeholder')),
		editorProps: {
			attributes: {
				class: 'prose lg:prose-xl bb-editor-inner',
			},
		}
	})

	const [debouncedEditor] = useDebounce(editor?.state.doc.content, 2000);
	useEffect(() => {
		if (debouncedEditor) {
			// save
			console.info('save', debouncedEditor)
		}
	}, [debouncedEditor]);

	return (<div className={'w-full'}>
			<div className={'editor-block w-full'}>
				{editor && <div className={'lg:flex md:hidden sm:hidden hidden'}><Sidebar eidtor={editor}/></div>}

				<div className={'editor-section'}>
					{editor && <MenuBar editor={editor}/>}
					<EditorContent editor={editor}/>
					{editor && <MenuBubble editor={editor}/>}

					{editor && <div className="character-count">
            <span>{Math.abs(editor.state.selection.$from.pos - editor.state.selection.$to.pos)} selected</span>
            &nbsp;&nbsp;
            <span>{editor.storage.characterCount.characters()} characters</span>
            &nbsp;&nbsp;
            <span>{editor.storage.characterCount.words()} words</span>
          </div>}
				</div>
			</div>
		</div>
	)
}

export default LiveEditor