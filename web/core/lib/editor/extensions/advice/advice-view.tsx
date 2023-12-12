import { Editor } from "@tiptap/core"
import React, { useEffect, useRef, useState } from "react";
import { AdviceManager } from "@/editor/extensions/advice/advice-manager";
import { Advice } from "@/editor/extensions/advice/advice";

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
		const adviceInput = advicesSectionRef.current.querySelector<HTMLInputElement>(`p#${id}`)
		if (!adviceInput) return
		adviceInput.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		})
	}

	useEffect(() => {
		AdviceManager.getInstance().on('add', (advice) => {
			setAdvices(AdviceManager.getInstance().getAdvices());
			setActiveId(advice.id);
			setTimeout(() => {
				focusAdviceWithActiveId(advice.id);
			});
		});

		AdviceManager.getInstance().on('remove', (advice) => {
			setAdvices(AdviceManager.getInstance().getAdvices());
		});

		AdviceManager.getInstance().onActiveIdChange((id) => {
			setActiveId(id);
			setTimeout(() => {
				focusAdviceWithActiveId(id);
			});
		});
	}, []);

	return <section
		className='flex flex-col border w-96 h-screen border-slate-200 bg-gray-50 dark:bg-gray-400 lg:flex md:hidden sm:hidden hidden'
		ref={advicesSectionRef}>
		{advices.length ? (advices.map(advice => (
				<div
					key={advice.id}
					className={`flex flex-col gap-4 p-2 border border-slate-400 ${advice.id === activeCommentId ? 'bg-slate-300 border-2' : ''} box-border`}
				>
          <span className='flex items-end gap-2'>
						AI Assistant
            <span className='text-xs text-slate-400'>
              {advice.createdAt.toLocaleDateString()}
            </span>
          </span>

					<p id={advice.id}
					   className={`p-2 text-inherit h-full bg-transparent focus:outline-none ${advice.id === activeCommentId ? 'bg-slate-300' : ''}`}
					>{advice.content || ''}</p>

					<div className={'flex'}>
						<button
							className='rounded-md bg-red-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20'
							onClick={() => {
								AdviceManager.getInstance().removeAdvice(advice.id)
								editor.commands.unsetAdvice(advice.id)
								editor.commands.focus()
							}}
						>
							Reject
						</button>
						<button
							className='rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20'
							onClick={() => {
								console.log(advice.content)
								editor.commands?.replaceRange(advice.content)
								setActiveId(null)
								editor.commands.unsetAdvice(advice.id)
								AdviceManager.getInstance().removeAdvice(advice.id)
								editor.commands.focus()
							}}
						>
							Accept
						</button>
					</div>
				</div>
			))
		) : (<span className='pt-8 text-center text-slate-400 w-96'>No advices yet</span>)
		}
	</section>
}