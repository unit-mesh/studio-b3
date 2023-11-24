import { BubbleMenu } from '@tiptap/react'
import React from 'react'
import { ChangeSet } from 'prosemirror-changeset'
import { useTranslation } from 'react-i18next'
import { ChangeForm, FacetType, PromptAction } from '@/types/custom-action.type'
import { Editor } from "@tiptap/core";
import { ActionExecutor } from "@/components/editor/action/ActionExecutor";

// @ts-ignore
const { computeDiff } = ChangeSet

export const MenuBubble = ({ editor }: { editor: Editor }) => {
	// @ts-ignore
	const selection = editor.commands?.getSelectedText()
	let selectLength = selection?.length ? selection.length : 0
	const { t, i18n } = useTranslation()
	// @ts-ignore
	const menus: PromptAction[] = editor?.commands?.getAiActions(FacetType.BUBBLE_MENU) || []

	return <BubbleMenu className={'ToggleGroup'} editor={editor} tippyOptions={{ duration: 100 }}>
		<div className={'BubbleMenuGroup'}>
			{editor.isActive('heading', { level: 1 }) && <button
        value="left" aria-label="Left aligned"
        className={editor.isActive('bold') ? 'is-active BubbleMenuItem' : 'BubbleMenuItem'}
      >优化标题</button>
			}
			{selectLength < 64 && <button
        value="left" aria-label="Left aligned"
        className={editor.isActive('bold') ? 'is-active BubbleMenuItem' : 'BubbleMenuItem'}>扩写</button>
			}
			{menus && menus.map((menu, index) => {
				return <button
					key={index}
					className="BubbleMenuItem"
					onClick={() => {

						// @ts-ignore
						const selection = editor.state.selection
						let posInfo = new ActionExecutor(menu, editor).position(selection);

						if (menu.changeForm == ChangeForm.DIFF) {
							// @ts-ignore
							editor.commands?.setTrackChangeStatus(true)
						}

						editor.chain().focus().insertContentAt(posInfo, "TODO").run()

						if (menu.changeForm == ChangeForm.DIFF) {
							// @ts-ignore
							editor.commands?.setTrackChangeStatus(false)
						}
					}}
				>
					{menu.i18Name ? t(menu.name) : menu.name}
				</button>
			})}
		</div>
	</BubbleMenu>
}