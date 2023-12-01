import { Editor } from "@tiptap/core"
import React, { useEffect, useRef, useState } from "react";
import { AdviceManager } from "@/components/editor/advice/advice-manager";
import { Advice } from "@/components/editor/advice/advice";

export interface AdviceViewProps {
	editor: Editor
}

// based on : https://github.com/sereneinserenade/tiptap-comment-extension/blob/d8ad0d01e98ac416e69f27ab237467b782076c16/demos/react/src/components/Tiptap.tsx
export const AdviceView = ({ editor }: AdviceViewProps) => {
	const [advices, setAdvices] = useState<Advice[]>([])
	const [activeCommentId, setActiveId] = useState<string | null>(null)
	const advicesSectionRef = useRef<HTMLDivElement | null>(null)

	const focusAdviceWithActiveId = (id: string) => {
		if (!advicesSectionRef.current) return
		const adviceInput = advicesSectionRef.current.querySelector<HTMLInputElement>(`input#${id}`)
		if (!adviceInput) return
		adviceInput.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		})
	}

	useEffect(() => {
		AdviceManager.getInstance().on('add', (advice) => {
			setAdvices((prevAdvices) => {
				const newAdvice = [...prevAdvices, advice];
				setActiveId(advice.id);
				setTimeout(focusAdviceWithActiveId);
				return newAdvice;
			});
		});

		AdviceManager.getInstance().onActiveIdChange((id) => {
			setActiveId(id);
			setTimeout(focusAdviceWithActiveId);
		});
	}, []);

	return <section className='flex flex-col gap-2 p-2 border rounded-lg w-96 border-slate-200'
	                ref={advicesSectionRef}>
		{advices.length ? (advices.map(advice => (
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
						onInput={(event) => {
							const value = (event.target as HTMLInputElement).value

							setAdvices(advices.map(advice => {
								if (advice.id === activeCommentId) {
									return {
										...advice,
										content: value
									}
								}

								return advice
							}))
						}}
						onKeyDown={(event) => {
							if (event.key !== 'Enter') return
							setActiveId(null)
						}}
					/>

					{advice.id === activeCommentId && (
						<button
							className='rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20'
							onClick={() => {
								setActiveId(null)
								editor.commands.focus()
							}}
						>
							Accept
						</button>
					)}
				</div>
			))
		) : (<span className='pt-8 text-center text-slate-400'>No advices yet</span>)
		}
	</section>
}