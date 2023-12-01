import { BubbleMenu } from '@tiptap/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChangeForm, DefinedVariable, FacetType, OutputForm, PromptAction } from '@/types/custom-action.type'
import { Editor } from "@tiptap/core";
import { CookieIcon } from "@radix-ui/react-icons";
import { ActionExecutor } from "@/components/editor/action/ActionExecutor";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { newAdvice } from '../../advice/advice';
import "../../action/command-functions";

export const MenuBubble = ({ editor }: {
	editor: Editor
}) => {
	const selection = editor.commands?.getSelectedText()
	let selectLength = selection?.length ? selection.length : 0
	const { t, i18n } = useTranslation()

	const menus = editor?.commands?.getAiActions(FacetType.BUBBLE_MENU) || [];
	const smartMenus: PromptAction[] = [];

	if (editor.isActive('heading', { level: 1 })) {
		smartMenus.push({
			name: '优化子标题',
			template: `优化文章的子标题 ###{{${DefinedVariable.SELECTION}}}###`,
			facetType: FacetType.BUBBLE_MENU,
			changeForm: ChangeForm.DIFF,
			outputForm: OutputForm.TEXT,
		})
	}

	if (selectLength < 64) {
		smartMenus.push({
			name: '扩写',
			template: `根据如下的内容扩写，只返回三句，限 100 字以内。###{{${DefinedVariable.SELECTION}}}###。`,
			facetType: FacetType.BUBBLE_MENU,
			changeForm: ChangeForm.DIFF,
			outputForm: OutputForm.TEXT,
		})
	}

	if (selectLength > 3 && editor.isActive('paragraph')) {
		smartMenus.push({
			name: '润色',
			template: `优化表达：###{{${DefinedVariable.SELECTION}}}###`,
			facetType: FacetType.BUBBLE_MENU,
			changeForm: ChangeForm.DIFF,
			outputForm: OutputForm.TEXT,
		})
	}

	menus.map((menu, index) => {
		if (menu.i18Name) {
			menu.name = t(menu.name)
		}

		menu.action = () => {
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
		}
	});

	return <BubbleMenu className={'bubble-menu-group w-64 bg-white'} editor={editor}>
		<div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="soft">
						Ask AI
						<CookieIcon/>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content variant="solid">
					{menus?.map((menu, index) => {
						return (
							<DropdownMenu.Item
								key={index}
								className={"DropdownMenuItem"}
								onClick={() => {
									editor.chain().callLlm(menu);
								}}
							>
								{menu.name}
							</DropdownMenu.Item>
						);
					})}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>

		{smartMenus && smartMenus.map((menu, index) => {
			return <Button
				color="orange"
				variant="outline"
				key={index}
				onClick={async () => {
					const text = await editor.commands?.callLlm(menu);

					const newComment = newAdvice(text || "")
					editor.commands?.setAdvice(newComment.id)
					editor.commands?.setAdviceCommand(newComment)
					menu.action?.(editor)
					editor.commands?.focus()
				}}
			>
				{menu.i18Name ? t(menu.name) : menu.name}
			</Button>
		})}
	</BubbleMenu>
}