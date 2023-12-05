import { CookieIcon } from "@radix-ui/react-icons";
import React, { useCallback, useEffect } from "react";
import { Editor } from "@tiptap/core";
import { Button, DropdownMenu } from "@radix-ui/themes";

import { FacetType } from "@/components/editor/defs/custom-action.type";

export const ToolbarAiDropdown = ({ editor }: {
	editor: Editor
}) => {
	const [menus, setMenus] = React.useState<any[]>([]);

	useEffect(() => {
		setMenus(editor?.commands?.getAiActions(FacetType.TOOLBAR_MENU));
	}, [editor]);

	return (
		<DropdownMenu.Root onOpenChange={() => {
			let aiActions = editor?.commands?.getAiActions(FacetType.TOOLBAR_MENU);
			setMenus(aiActions)
		}}>
			<DropdownMenu.Trigger>
				<Button className={'bg-pink-500 text-white toolbar-ai-button'}>
					AI
					<CookieIcon/>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content variant="solid">
				{menus?.map((menu, index) => {
					return <DropdownMenu.Item
						key={index}
						className="DropdownMenuItem"
						onClick={() => {
							editor.chain().callLlm(menu);
						}}
					>
						{menu.name}
					</DropdownMenu.Item>
				})}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};
