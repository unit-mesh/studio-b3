import { BubbleMenu } from '@tiptap/react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Editor } from "@tiptap/core";
import { CookieIcon } from "@radix-ui/react-icons";
import { Button, DropdownMenu } from "@radix-ui/themes";
import BounceLoader from "react-spinners/BounceLoader";

import { ActionExecutor } from "@/components/editor/action/ActionExecutor";
import { ChangeForm, DefinedVariable, FacetType, OutputForm, PromptAction } from '@/types/custom-action.type'
import { newAdvice } from '@/components/editor/advice/advice';

export const MenuBubble = ({ editor }: {
	editor: Editor
}) => {
	const [loading, setLoading] = React.useState(false);
	const { t, i18n } = useTranslation()

	const [smartMenus, setSmartMenus] = React.useState<PromptAction[]>([]);
	const [menus, setMenus] = React.useState<any[]>([]);

	function buildMenus(): PromptAction[] {
		const originMenus = editor?.commands?.getAiActions(FacetType.BUBBLE_MENU) || [];
		originMenus.map((menu, index) => {
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

		return originMenus
	}

	useEffect(() => {
		const selection = editor.commands?.getSelectedText()
		let selectLength = selection?.length ? selection.length : 0

		const innerSmartMenus: PromptAction[] = []

		if (editor.isActive('heading', { level: 1 })) {
			innerSmartMenus.push({
				name: '优化子标题',
				template: `优化文章的子标题 ###{{${DefinedVariable.SELECTION}}}###`,
				facetType: FacetType.BUBBLE_MENU,
				changeForm: ChangeForm.DIFF,
				outputForm: OutputForm.TEXT,
			})
		}

		if (selectLength < 64) {
			innerSmartMenus.push({
				name: '扩写',
				template: `根据如下的内容扩写，只返回三句，限 100 字以内。###{{${DefinedVariable.SELECTION}}}###。`,
				facetType: FacetType.BUBBLE_MENU,
				changeForm: ChangeForm.DIFF,
				outputForm: OutputForm.TEXT,
			})
		}

		if (selectLength > 3 && editor.isActive('paragraph')) {
			innerSmartMenus.push({
				name: '润色',
				template: `优化表达：###{{${DefinedVariable.SELECTION}}}###`,
				facetType: FacetType.BUBBLE_MENU,
				changeForm: ChangeForm.DIFF,
				outputForm: OutputForm.TEXT,
			})
		}

		setSmartMenus(innerSmartMenus)
		setMenus(buildMenus())
	}, [editor, menus]);

	return <BubbleMenu className={'bubble-menu-group w-64 bg-white'} editor={editor} tippyOptions={{ duration: 100 }}>
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
			if (loading) {
				return <BounceLoader
					key={index}
					loading={loading}
					size={32}
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
			}

			return <Button
				color="orange"
				variant="outline"
				key={index}
				onClick={async () => {
					setLoading(true)

					const text = await editor.commands?.callLlm(menu);
					setLoading(false)

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