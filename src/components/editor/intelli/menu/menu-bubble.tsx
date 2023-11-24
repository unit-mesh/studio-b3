import { BubbleMenu } from '@tiptap/react'
import React from 'react'
import { MagicWandIcon } from '@radix-ui/react-icons'
import { Span, Change, ChangeSet } from 'prosemirror-changeset'
import { useTranslation } from 'react-i18next'
import { FacetType, PromptAction } from '@/types/custom-action.type'
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
			{selectLength > 64 && <>
        <button
          onClick={() => {
	          // @ts-ignore
						editor.commands?.setTrackChangeStatus(true)

						const selection = editor.state.selection
						editor.chain().focus().insertContentAt({
							from: selection.from,
							to: selection.to
						}, '永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右').run()

						let content1 = '永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右'
						let content2 = '岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右'
						let diff: any[] = []
						let output = computeDiff(content1, content2, diff)
						console.log(output)

	          // @ts-ignore
						editor.commands.setTrackChangeStatus(false)
					}}
          value="left" aria-label="Left aligned"
          className={editor.isActive('bold') ? 'is-active BubbleMenuItem' : 'BubbleMenuItem'}
        >
          <MagicWandIcon/> 优化表达
        </button>
      </>
			}
			{menus && menus.map((menu, index) => {
				return <button
					key={index}
					className="BubbleMenuItem"
					onClick={() => {

						// @ts-ignore
						const selection = editor.state.selection
						let posInfo = new ActionExecutor(menu, editor).position(selection);

						editor.chain().focus().insertContentAt(posInfo, "TODO").run()
					}}
				>
					{menu.i18Name ? t(menu.name) : menu.name}
				</button>
			})}
		</div>
	</BubbleMenu>
}