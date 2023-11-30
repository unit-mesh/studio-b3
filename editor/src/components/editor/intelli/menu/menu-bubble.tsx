import { BubbleMenu } from '@tiptap/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChangeForm, FacetType, OutputForm, PromptAction } from '@/types/custom-action.type'
import { Editor } from "@tiptap/core";
import { CookieIcon } from "@radix-ui/react-icons";
import { ActionExecutor } from "@/components/editor/action/ActionExecutor";
import { Button, DropdownMenu } from "@radix-ui/themes";

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
			template: '优化子标题',
			facetType: FacetType.BUBBLE_MENU,
			outputForm: OutputForm.DIFF,
		})
	}

	if (selectLength < 64) {
		smartMenus.push({
			name: '扩写',
			template: `根据如下的内容扩写：{{selection}}`,
			facetType: FacetType.BUBBLE_MENU,
			outputForm: OutputForm.DIFF,
		})
	}

	if (selectLength > 3 && editor.isActive('paragraph')) {
		smartMenus.push({
			name: '润色',
			template: '优化表达：{{selection}}',
			facetType: FacetType.BUBBLE_MENU,
			outputForm: OutputForm.DIFF,
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
				<DropdownMenu.Content>
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
				onClick={() => {
					menu.action?.(editor)
				}}
			>
				{menu.i18Name ? t(menu.name) : menu.name}
			</Button>
		})}
	</BubbleMenu>
}