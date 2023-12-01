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
import { Comment } from "@/components/editor/advice/comment";

const md = new MarkdownIt()

const LiveEditor = () => {
	const { t, i18n } = useTranslation();

	// based on : https://github.com/sereneinserenade/tiptap-comment-extension/blob/d8ad0d01e98ac416e69f27ab237467b782076c16/demos/react/src/components/Tiptap.tsx
	const [activeCommentId, setActiveCommentId] = useState<string | null>(null)
	const commentsSectionRef = useRef<HTMLDivElement | null>(null)

	const focusCommentWithActiveId = (id: string) => {
		if (!commentsSectionRef.current) return

		const commentInput = commentsSectionRef.current.querySelector<HTMLInputElement>(`input#${id}`)

		if (!commentInput) return

		commentInput.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		})
	}

	const [comments, setComments] = useState<Comment[]>([])

	const extensions = [
		// we define all commands here
		CommandFunctions,
		AdviceExtension.configure({
			HTMLAttributes: {
				class: "my-advice",
			},
			setAdviceCommand: (comment: Comment) => {
				setComments([...comments, comment])
				setActiveCommentId(comment.id)
				setTimeout(() => console.log(comments))
				setTimeout(focusCommentWithActiveId)
			},
			onAdviceActivated: (commentId) => {
				setActiveCommentId(commentId)

				if (commentId) setTimeout(() => focusCommentWithActiveId(commentId))
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
			{ editor && <section className='flex flex-col gap-2 p-2 border rounded-lg w-96 border-slate-200 fixed top-0 right-0 ' ref={commentsSectionRef}>
				{
					comments.length ? (
						comments.map(comment => (
							<div
								key={comment.id}
								className={`flex flex-col gap-4 p-2 border rounded-lg border-slate-400 ${comment.id === activeCommentId ? 'border-blue-400 border-2' : ''} box-border`}
							>
                      <span className='flex items-end gap-2'>
                        <a href='https://github.com/unit-mesh/b3' className='font-semibold border-b border-blue-200'>
                          Studio B3 AI
                        </a>

                        <span className='text-xs text-slate-400'>
                          {comment.createdAt.toLocaleDateString()}
                        </span>
                      </span>

								<input
									value={comment.content || ''}
									disabled={comment.id !== activeCommentId}
									className={`p-2 rounded-lg text-inherit bg-transparent focus:outline-none ${comment.id === activeCommentId ? 'bg-slate-600' : ''}`}
									id={comment.id}
									onInput={
										(event) => {
											const value = (event.target as HTMLInputElement).value

											setComments(comments.map(comment => {
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
									onKeyDown={
										(event) => {
											if (event.key !== 'Enter') return
											setActiveCommentId(null)
										}
									}
								/>

								{
									comment.id === activeCommentId && (
										<button
											className='rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20'
											onClick={() => {
												setActiveCommentId(null)
												editor.commands.focus()
											}}
										>
											Save
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