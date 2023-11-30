import { BubbleMenu } from '@tiptap/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChangeForm, FacetType, OutputForm, PromptAction } from '@/types/custom-action.type'
import { Editor } from "@tiptap/core";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CookieIcon } from "@radix-ui/react-icons";
import { ActionExecutor } from "@/components/editor/action/ActionExecutor";

export const MenuBubble = ({ editor }: { editor: Editor }) => {
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
			template: '搞定',
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

	return <BubbleMenu className={'BubbleMenuGroup'} editor={editor} tippyOptions={{ duration: 100 }}>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button className={"top-0 right-0 transform -translate-x-1 -translate-y-0.5"}>
					Ask AI
					<CookieIcon/>
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="DropdownMenuContent">
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
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
		{smartMenus && smartMenus.map((menu, index) => {
			return <button
				key={index}
				className="BubbleMenuItem"
				onClick={() => {
					menu.action?.(editor)
				}}
			>
				{menu.i18Name ? t(menu.name) : menu.name}
			</button>
		})}
	</BubbleMenu>
}