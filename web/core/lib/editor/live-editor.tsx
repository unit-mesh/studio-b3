import React, { useEffect } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { CharacterCount } from "@tiptap/extension-character-count";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import MarkdownIt from 'markdown-it'
import { useTranslation } from "react-i18next";
import { useDebounce } from 'use-debounce';

import "./editor.css"

import { InlineCompletion } from "@/editor/extensions/inline-completion/inline-completion";
import { MenuBubble } from '@/editor/menu/menu-bubble'
import { createSlashExtension } from '@/editor/extensions/slash-command/slash-extension.ts'
import { createQuickBox } from '@/editor/extensions/quick-box/quick-box-extension'
import { AdviceExtension } from '@/editor/extensions/advice/advice-extension';
import { ToolbarMenu } from '@/editor/menu/toolbar-menu.tsx'
import { CustomEditorCommands } from '@/editor/action/custom-editor-commands.ts'
import { Sidebar } from '@/editor/components/sidebar.tsx'
import { Advice } from "@/editor/extensions/advice/advice";
import { AdviceManager } from "@/editor/extensions/advice/advice-manager";
import { AdviceView } from "@/editor/extensions/advice/advice-view";
import { Settings } from "@/editor/components/settings";
import { PromptsManager } from '@/editor/prompts/prompts-manager.ts';

const md = new MarkdownIt()

export const setupExtensions = (promptsManager: PromptsManager = PromptsManager.getInstance()) => {
	return [
		// we define all commands here
		CustomEditorCommands(promptsManager),
		AdviceExtension.configure({
			HTMLAttributes: {
				class: "my-advice",
			},
			setAdviceCommand: (advice: Advice) => {
				AdviceManager.getInstance().addAdvice(advice);
			},
			onAdviceActivated: (adviceId) => {
				if (adviceId) AdviceManager.getInstance().setActiveId(adviceId);
			},
		}),
		InlineCompletion,
		StarterKit.configure({
			bulletList: {
				keepMarks: true,
				keepAttributes: false,
			},
			orderedList: {
				keepMarks: true,
				keepAttributes: false,
			},
		}),
		createSlashExtension(promptsManager),
		createQuickBox(),
		CharacterCount.configure({}),
		Color.configure({ types: [TextStyle.name, ListItem.name] }),
		// @ts-ignore
		TextStyle.configure({ types: [ListItem.name] }),
		Table,
		TableRow,
		TableCell,
		TableHeader
	]
}

const LiveEditor = () => {
	const { t } = useTranslation();

	const editor = useEditor({
		extensions: setupExtensions(PromptsManager.getInstance()),
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
			localStorage.setItem('editor', JSON.stringify(editor.getJSON()))
		}
	}, [debouncedEditor]);

	useEffect(() => {
		const content = localStorage.getItem('editor');
		if (content) {
			try {
				editor?.commands?.setContent(JSON.parse(content));
			} catch (e) {
				editor?.commands?.setContent(md.render(t('Editor Placeholder')));
				console.error(e);
			}
		}
	}, [editor]);

	return <div className={'w-full flex editor-block'}>
		{editor && <div className={'lg:flex md:hidden sm:hidden hidden'}><Sidebar eidtor={editor}/></div>}

		<div className={'w-full editor-section'}>
			{editor && <Settings editor={editor}/>}
			{editor && <ToolbarMenu className={'toolbar-menu'} editor={editor}/>}
			<div className={'editor-main'}>
				<EditorContent editor={editor}/>
				<div>{editor && <MenuBubble editor={editor}/>}</div>

				{editor && <div className="character-count">
          <p className={'p-2'}>{editor.storage.characterCount.characters()} characters</p>
          <p className={'p-2'}>{editor.storage.characterCount.words()} words</p>
        </div>
				}
			</div>
		</div>
		{editor && <AdviceView editor={editor}/>}
	</div>
}

export default LiveEditor
