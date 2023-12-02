import { CookieIcon } from "@radix-ui/react-icons";
import React from "react";
import { FacetType } from "@/types/custom-action.type";
import { Editor } from "@tiptap/core";
import { Button, DropdownMenu } from "@radix-ui/themes";

export const MenuAiDropdown = ({ editor }: {
	editor: Editor
}) => {
	const [menus, setMenus] = React.useState<any[]>([]);

	React.useEffect(() => {
		setMenus(editor?.commands?.getAiActions(FacetType.TOOLBAR_MENU));
	}, []);

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button className={'bg-pink-500 text-white'}>
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
