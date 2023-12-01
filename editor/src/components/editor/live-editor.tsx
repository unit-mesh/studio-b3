import React, { useEffect, useRef, useState } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { CharacterCount } from "@tiptap/extension-character-count";
import { useTranslation } from "react-i18next";

import MarkdownIt from 'markdown-it'
import { useDebounce } from 'use-debounce';

import { createInlineCompletion } from "./inline/inline-completion";
import { MenuBubble } from './intelli/menu/menu-bubble'
import { createSlashExtension } from './intelli/slash-extension'
import { createAiBlock } from './intelli/ai-block-extension'
import { AdviceExtension } from './advice/advice-extension';

import TrackChangeExtension from './diff/track-change-extension'
import { MenuBar } from './menu-bar'
import { CommandFunctions } from './action/command-functions'
import { Sidebar } from './sidebar'

import "./editor.css"
import { Advice } from "@/components/editor/advice/advice";
import { AdviceManager } from "@/components/editor/advice/advice-manager";

const md = new MarkdownIt()

const LiveEditor = () => {
	const { t, i18n } = useTranslation();

	// based on : https://github.com/sereneinserenade/tiptap-comment-extension/blob/d8ad0d01e98ac416e69f27ab237467b782076c16/demos/react/src/components/Tiptap.tsx
	const [activeCommentId, setActiveId] = useState<string | null>(null)
	const commentsSectionRef = useRef<HTMLDivElement | null>(null)

	const focusAdviceWithActiveId = (id: string) => {
		if (!commentsSectionRef.current) return

		const commentInput = commentsSectionRef.current.querySelector<HTMLInputElement>(`input#${id}`)

		if (!commentInput) return

		commentInput.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		})
	}

	const [advices, setAdvices] = useState<Advice[]>([])

	const extensions = [
		// we define all commands here
		CommandFunctions,
		AdviceExtension.configure({
			HTMLAttributes: {
				class: "my-advice",
			},
			setAdviceCommand: (advice: Advice) => {
				AdviceManager.getInstance().addAdvice(advice);
			},
			onAdviceActivated: (adviceId) => {
				setActiveId(adviceId)
				if (adviceId) setTimeout(() => focusAdviceWithActiveId(adviceId))
			},
		}),
		TrackChangeExtension.configure({
			enabled: false,
		}),
		createInlineCompletion(),
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
		createSlashExtension('ai-slash'),
		createAiBlock(),
		CharacterCount.configure({}),
		Color.configure({ types: [TextStyle.name, ListItem.name] }),
		// @ts-ignore
		TextStyle.configure({ types: [ListItem.name] }),
	]

	useEffect(() => {
		AdviceManager.getInstance().on('add', (advice) => {
			setAdvices((prevAdvices) => {
				const newAdvice = [...prevAdvices, advice];
				setActiveId(advice.id);
				setTimeout(focusAdviceWithActiveId);
				return newAdvice;
			});
		});
	}, []);

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
			console.info('todo: add save logic', debouncedEditor)
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
			{editor &&
        <section className='flex flex-col gap-2 p-2 border rounded-lg w-96 border-slate-200 fixed top-0 right-0 '
                 ref={commentsSectionRef}>
					{advices.length ? (
						advices.map(advice => (
							<div
								key={advice.id}
								className={`flex flex-col gap-4 p-2 border rounded-lg border-slate-400 ${advice.id === activeCommentId ? 'bg-slate-300 border-2' : ''} box-border`}
							>
                <span className='flex items-end gap-2'>
                  <a href='https://github.com/unit-mesh/b3' className='font-semibold border-b border-blue-200'>
                    Studio B3 AI
                  </a>

                  <span className='text-xs text-slate-400'>
                    {advice.createdAt.toLocaleDateString()}
                  </span>
                </span>

								<input
									value={advice.content || ''}
									disabled={advice.id !== activeCommentId}
									className={`p-2 rounded-lg text-inherit bg-transparent focus:outline-none ${advice.id === activeCommentId ? 'bg-slate-600' : ''}`}
									id={advice.id}
									onInput={
										(event) => {
											const value = (event.target as HTMLInputElement).value

											setAdvices(advices.map(comment => {
												if (comment.id === activeCommentId) {
													return {
														...comment,
														content: value
													}
												}

												return comment
											}))
										}
									}
									onKeyDown={(event) => {
										if (event.key !== 'Enter') return
										setActiveId(null)
									}}
								/>

								{
									advice.id === activeCommentId && (
										<button
											className='rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20'
											onClick={() => {
												setActiveId(null)
												editor.commands.focus()
											}}
										>
											Accept
										</button>
									)
								}
							</div>
						))
					) : (<span className='pt-8 text-center text-slate-400'>No comments yet</span>)
					}
        </section>
			}
		</div>
	)
}

export default LiveEditor